# Bangladesh Geocode Ecommerce and API Guide

This guide shows ecommerce developers how to connect Bangladesh Geocode to an address form, automatically link Division → District → Upazila → Union fields, look up postal codes, validate customer addresses, and expose the data through an application API.

The repository is a **data package and static dataset**, not a hosted SaaS API. Developers can use the files directly in a browser, bundle the Python package into a backend, import the SQL files into their own database, or build a small API endpoint for their storefront. This design keeps checkout available without depending on a third-party request at runtime.

## Recommended checkout architecture

A production checkout normally uses four location selectors and a postal-code field:

```text
Division
  ↓ division_id
District
  ↓ district_id
Upazila
  ↓ upazila_id
Union
  ↓ postcode / postal-code lookup
Postal code and delivery address
```

The parent IDs are the important part of the integration. Do not connect records by matching names because names can differ between English and Bengali representations. Store the selected IDs and validate each parent-child relationship on the server before creating an order.

A recommended order record stores the selected location snapshot rather than only the foreign keys. Location data may change in a later dataset release, while an order address should remain historically accurate.

| Order field | Example | Purpose |
| --- | --- | --- |
| `division_id` | `6` | Stable source identifier |
| `district_id` | `47` | Stable source identifier |
| `upazila_id` | `1` | Stable source identifier |
| `union_id` | `1` | Stable source identifier |
| `postcode` | `1206` | Customer-entered or selected postal code |
| `division_name` | `Dhaka` | Snapshot displayed on the order |
| `district_name` | `Dhaka` | Snapshot displayed on the order |
| `upazila_name` | `Dhamrai` | Snapshot displayed on the order |
| `union_name` | `Example Union` | Snapshot displayed on the order |
| `address_line` | `House 10, Road 2` | Customer address |

## Choose an integration method

| Method | Best for | Advantages | Tradeoff |
| --- | --- | --- | --- |
| Browser JSON files | Static sites and small storefronts | No backend endpoint required | The full dataset is downloaded by the browser |
| Python package | Django, Flask, FastAPI, scripts | Offline access and server-side validation | Requires a Python backend |
| SQL imports | Laravel, PHP, Node.js, WordPress, custom stores | Fast filtered queries and relational constraints | Requires database setup |
| Custom REST API | Multiple storefronts or mobile apps | One stable interface for all clients | Your application must host and secure it |

For a checkout, the safest general design is to load options in the browser for usability and repeat every selection validation on the backend for correctness.

## Browser implementation with automatic linking

The simplest browser integration reads the repository JSON files and filters child options whenever a parent changes. The following example assumes that the checkout page is served from the repository root or that the JSON files are copied into your own public assets directory.

The repository also includes a reusable, tested implementation at [`assets/checkout-autofill.mjs`](assets/checkout-autofill.mjs). Its automated tests are in [`tests/frontend/checkout-autofill.test.mjs`](tests/frontend/checkout-autofill.test.mjs) and can be run with `node --test tests/frontend/checkout-autofill.test.mjs`.

```html
<label>
  Division
  <select id="division" name="division_id" required>
    <option value="">Select division</option>
  </select>
</label>

<label>
  District
  <select id="district" name="district_id" required disabled>
    <option value="">Select district</option>
  </select>
</label>

<label>
  Upazila
  <select id="upazila" name="upazila_id" required disabled>
    <option value="">Select upazila</option>
  </select>
</label>

<label>
  Union
  <select id="union" name="union_id" required disabled>
    <option value="">Select union</option>
  </select>
</label>

<label>
  Postcode
  <input id="postcode" name="postcode" inputmode="numeric" autocomplete="postal-code" required>
</label>
```

```js
const files = {
  divisions: '/data/divisions/divisions.json',
  districts: '/data/districts/districts.json',
  upazilas: '/data/upazilas/upazilas.json',
  unions: '/data/unions/unions.json',
  postcodes: '/data/postcode-bd/postcode.json',
};

async function loadJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not load ${url}`);
  return response.json();
}

function exportRecords(exportValue) {
  // The repository JSON exports contain phpMyAdmin metadata objects.
  const table = exportValue.find(item => Array.isArray(item.data));
  return table ? table.data : exportValue;
}

function fillSelect(select, records, label = item => item.name) {
  select.replaceChildren(new Option('Select an option', ''));
  for (const record of records) {
    select.add(new Option(label(record), record.id));
  }
  select.disabled = records.length === 0;
}

const [divisionExport, districtExport, upazilaExport, unionExport, postcodeData] =
  await Promise.all(Object.values(files).map(loadJson));

const divisions = exportRecords(divisionExport);
const districts = exportRecords(districtExport);
const upazilas = exportRecords(upazilaExport);
const unions = exportRecords(unionExport);

const divisionSelect = document.querySelector('#division');
const districtSelect = document.querySelector('#district');
const upazilaSelect = document.querySelector('#upazila');
const unionSelect = document.querySelector('#union');
const postcodeInput = document.querySelector('#postcode');

fillSelect(divisionSelect, divisions);

divisionSelect.addEventListener('change', () => {
  const divisionId = divisionSelect.value;
  fillSelect(
    districtSelect,
    districts.filter(item => String(item.division_id) === divisionId),
  );
  fillSelect(upazilaSelect, []);
  fillSelect(unionSelect, []);
});

districtSelect.addEventListener('change', () => {
  const districtId = districtSelect.value;
  fillSelect(
    upazilaSelect,
    upazilas.filter(item => String(item.district_id) === districtId),
  );
  fillSelect(unionSelect, []);
});

upazilaSelect.addEventListener('change', () => {
  const upazilaId = upazilaSelect.value;
  fillSelect(
    unionSelect,
    unions.filter(item => String(item.upazilla_id ?? item.upazila_id) === upazilaId),
  );
});

postcodeInput.addEventListener('change', () => {
  const wanted = postcodeInput.value.trim();
  const match = Object.entries(postcodeData).find(([key]) => key.trim() === wanted);
  postcodeInput.setCustomValidity(match ? '' : 'Enter a valid Bangladesh postcode.');
});
```

### Important browser detail

The source JSON exports include metadata objects at the beginning of the file. The `exportRecords()` helper extracts the actual table records. The union export historically uses `upazilla_id`; code that reads the raw repository JSON should support that spelling. The Python package normalizes this field to `upazila_id`.

For a large store, do not ship all records on the first page load. Either create small API endpoints that filter by parent ID or generate one JSON file per parent during your build process.

## API design for a storefront

If your storefront has a backend, expose only the operations the checkout needs. A minimal REST API can use these routes:

```text
GET /api/locations/divisions
GET /api/locations/districts?division_id=6
GET /api/locations/upazilas?district_id=1
GET /api/locations/unions?upazila_id=1
GET /api/locations/postcodes/1206
POST /api/checkout/validate-address
```

The API should return stable JSON shapes. For example:

```json
{
  "data": [
    {
      "id": "1",
      "division_id": "6",
      "name": "Dhaka",
      "bn_name": "ঢাকা",
      "url": "www.dhaka.gov.bd"
    }
  ]
}
```

For a filtered route, return an empty array with HTTP 200 when no matching records exist. Use HTTP 400 for malformed parameters and HTTP 404 only when the requested resource itself does not exist.

A postcode response can preserve the bilingual source shape:

```json
{
  "data": {
    "1206": {
      "en": {
        "division": "Dhaka",
        "district": "Dhaka",
        "thana": "Dhaka",
        "suboffice": "Dhaka Cantonment--TSO",
        "postcode": "1206"
      },
      "bn": {
        "division": "ঢাকা",
        "district": "ঢাকা",
        "thana": "ঢাকা সেনানিবাস",
        "suboffice": "ঢাকা সেনানিবাস TSO",
        "postcode": "১২০৬"
      }
    }
  }
}
```

## FastAPI example

Install the package in the backend environment:

```bash
python -m pip install bangladesh-geo-data fastapi uvicorn
```

Create `app.py`:

```python
from fastapi import FastAPI, HTTPException, Query
from bangladesh_geo_data import (
    get_districts,
    get_district_boundaries,
    get_divisions,
    get_postcodes,
    get_unions,
    get_upazilas,
)

app = FastAPI(title="Bangladesh Location API", version="1.0.0")

@app.get('/api/locations/divisions')
def divisions():
    return {"data": get_divisions()}

@app.get('/api/locations/districts')
def districts(division_id: int | None = Query(default=None)):
    return {"data": get_districts(division_id)}

@app.get('/api/locations/upazilas')
def upazilas(district_id: int | None = Query(default=None)):
    return {"data": get_upazilas(district_id)}

@app.get('/api/locations/unions')
def unions(upazila_id: int | None = Query(default=None)):
    return {"data": get_unions(upazila_id)}

@app.get('/api/locations/postcodes/{postcode}')
def postcode(postcode: str):
    result = get_postcodes(postcode)
    if not result:
        raise HTTPException(status_code=404, detail='Postcode not found')
    return {"data": result}

@app.get('/api/locations/district-boundaries')
def boundaries():
    return {"data": get_district_boundaries()}
```

Run it with:

```bash
uvicorn app:app --reload
```

The frontend can then call `/api/locations/districts?division_id=6` instead of downloading the full district file.

## Django or Flask server-side usage

The package functions can be called directly inside a view or service layer:

```python
from bangladesh_geo_data import get_districts, get_postcodes


def checkout_location_options(division_id):
    return {
        'districts': get_districts(division_id=division_id),
    }


def postcode_details(value):
    return get_postcodes(value)
```

For a high-traffic store, load the data once at process startup or import it into the application database. Avoid parsing the large postal-code JSON file on every request.

## Server-side address validation

Client-side filtering improves the user experience but is not a security boundary. A customer can modify browser requests, so the backend must confirm that every selected child belongs to the selected parent.

```python
from bangladesh_geo_data import (
    get_districts,
    get_divisions,
    get_unions,
    get_upazilas,
)


def valid_address(division_id, district_id, upazila_id, union_id):
    division_ids = {str(item['id']) for item in get_divisions()}
    if str(division_id) not in division_ids:
        return False

    district = next(
        (item for item in get_districts(division_id) if str(item['id']) == str(district_id)),
        None,
    )
    if district is None:
        return False

    upazila = next(
        (item for item in get_upazilas(district_id) if str(item['id']) == str(upazila_id)),
        None,
    )
    if upazila is None:
        return False

    return any(
        str(item['id']) == str(union_id)
        for item in get_unions(upazila_id)
    )
```

If the address is invalid, reject the checkout request with a validation error. Do not silently replace a customer’s selected location with a different record.

## Postcode validation and delivery zones

A postal code identifies a postal area. It does not automatically prove that a customer supplied a valid street address or that your courier serves the area. Use the postcode data for lookup and normalization, then apply your own delivery-zone rules.

A delivery rule can be represented as:

```json
{
  "postcode": "1206",
  "serviceable": true,
  "shipping_fee": 80,
  "estimated_days": "1-2"
}
```

Recommended checkout sequence:

1. The customer selects the administrative location.
2. The customer enters a postcode.
3. The server normalizes whitespace and compares the postcode with `get_postcodes()` or your database table.
4. The server checks whether the postcode belongs to the selected district or delivery zone.
5. The server applies the merchant’s delivery fee and estimated delivery time.
6. The order stores the location and delivery decision as a snapshot.

Do not calculate delivery cost from an unvalidated postcode supplied only by the browser.

## SQL integration

The repository includes SQL exports for divisions, districts, upazilas, and unions. Import parent tables before child tables:

```bash
mysql your_database < divisions/divisions.sql
mysql your_database < districts/districts.sql
mysql your_database < upazilas/upazilas.sql
mysql your_database < unions/unions.sql
```

A relational checkout query should use parent IDs:

```sql
SELECT u.id, u.name, u.bn_name
FROM unions AS u
JOIN upazilas AS z ON z.id = u.upazila_id
JOIN districts AS d ON d.id = z.district_id
WHERE d.division_id = ?
  AND d.id = ?
  AND z.id = ?
ORDER BY u.name;
```

The exact column spelling in a SQL export should be checked before import because the historical source exports may use `upazilla_id` in some files. If your database uses the historical spelling, either keep it consistently in SQL queries or rename it once during migration to `upazila_id`.

## PHP example

The repository provides PHP exports that can be included in a PHP storefront:

```php
require __DIR__ . '/data/divisions/divisions.php';
require __DIR__ . '/data/districts/districts.php';

$divisionId = $_GET['division_id'] ?? null;
$filteredDistricts = array_values(array_filter(
    $districts,
    fn ($row) => $divisionId !== null
        && (string) $row['division_id'] === (string) $divisionId
));

header('Content-Type: application/json');
echo json_encode(['data' => $filteredDistricts], JSON_UNESCAPED_UNICODE);
```

For production, place this logic behind your normal application routing, authentication, rate limiting, and error handling instead of exposing raw files directly.

## Checkout form submission

A checkout request should send IDs and customer address fields together:

```json
{
  "division_id": "6",
  "district_id": "47",
  "upazila_id": "1",
  "union_id": "1",
  "postcode": "1206",
  "address_line": "House 10, Road 2",
  "recipient_name": "Customer Name",
  "phone": "+8801XXXXXXXXX"
}
```

The backend should then:

- validate required fields and maximum lengths;
- verify the complete parent-child chain;
- normalize postcode whitespace;
- check postcode and delivery-zone rules;
- validate the phone number according to the merchant’s policy;
- calculate shipping on the server;
- save the selected names as an order snapshot;
- return a clear validation response if anything fails.

A successful response can include the normalized address:

```json
{
  "valid": true,
  "address": {
    "division_id": "6",
    "district_id": "47",
    "upazila_id": "1",
    "union_id": "1",
    "postcode": "1206"
  },
  "shipping": {
    "serviceable": true,
    "fee": 80,
    "currency": "BDT",
    "estimated_days": "1-2"
  }
}
```

## API caching and performance

Location data changes much less often than checkout traffic. Cache the results of division and parent-filtered location requests. Use an application cache or a long-lived in-memory object on the backend. Add an `ETag` or a version identifier to custom API responses so browser clients can reuse unchanged data.

Do not add an external geocoding request to every checkout. Bangladesh Geocode supplies administrative and postal reference data; it is not a street-level address verification service. If a courier requires a separate address service, call it only after validating the local administrative selection.

## Bengali and English display

The data contains both `name` and `bn_name`. Let the customer choose a language or use the storefront’s active locale:

```js
function locationLabel(record, language) {
  return language === 'bn' && record.bn_name ? record.bn_name : record.name;
}
```

Keep the IDs unchanged when switching languages. Only the visible labels should change.

## Common mistakes

### Importing the package name instead of the module name

The PyPI name contains hyphens, but the Python import uses underscores:

```python
# Correct
from bangladesh_geo_data import get_districts

# Incorrect
# import bangladesh-geo-data
```

### Trusting browser values

A disabled child selector is a user-interface feature, not validation. Always check the selected relationship on the backend.

### Joining by name

Do not join locations by English or Bengali names. Use IDs and retain both display names for the order snapshot.

### Treating postcode as a complete address

A postcode is not enough to deliver an order. Keep house, road, area, phone, and recipient fields separately.

### Assuming a hosted API exists

The repository and PyPI package do not provide a public HTTP endpoint. If a client needs HTTP, host the API routes in your own application as shown above.

## Release and data updates

Pin the package version in production:

```text
bangladesh-geo-data==0.1.0
```

When the repository publishes a new version, test the record counts and parent relationships in a staging environment before updating production. The release workflow builds and validates the package before publishing it to PyPI.

## Support and attribution

For data corrections, open an issue in the [Bangladesh Geocode repository](https://github.com/bayeziddev/Bangladesh-geocode/issues) and include the record, current value, proposed value, and evidence. The data and package are distributed under the MIT License.
