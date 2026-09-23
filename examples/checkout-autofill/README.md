# Beginner Checkout Auto-fill Example

This folder contains a complete copy-paste checkout example. It demonstrates Division → District → Upazila → Union cascading fields and postcode validation.

## Option A: Use raw JSON in the frontend

This option needs no package installation. It reads the repository files directly from the browser.

From the repository root, start a local static server:

```bash
python -m http.server 8000
```

Open:

```text
http://localhost:8000/examples/checkout-autofill/
```

The browser loads these files:

```text
../../divisions/divisions.json
../../districts/districts.json
../../upazilas/upazilas.json
../../unions/unions.json
../../postcode-bd/postcode.json
```

If you copy `index.html` into another project, copy the five data files too and update the paths in the `DATA` object. The JSON exports include phpMyAdmin metadata, so the example’s `records()` helper extracts the actual rows.

## Option B: Use the PyPI package in a backend

Create a virtual environment and install the published package:

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install bangladesh-geo-data==0.1.0
python pypi_backend.py
```

The backend example uses:

```python
from bangladesh_geo_data import (
    get_districts,
    get_divisions,
    get_postcodes,
    get_unions,
    get_upazilas,
)
```

Use the package on the server to validate the browser’s submitted IDs. Do not trust the browser alone. The example rejects a district from the wrong division, an upazila from the wrong district, a union from the wrong upazila, and a postcode that does not belong to the selected district.

Pin the version in production so the checkout uses a known data snapshot:

```text
bangladesh-geo-data==0.1.0
```

## Option C: Connect the frontend to your own API

For a large ecommerce site, keep the data on the backend and expose filtered endpoints:

```text
GET /api/locations/divisions
GET /api/locations/districts?division_id=6
GET /api/locations/upazilas?district_id=47
GET /api/locations/unions?upazila_id=365
GET /api/locations/postcodes/1206
POST /api/checkout/validate-address
```

Replace the `fetch()` paths in `index.html` with your API URLs. The frontend should still use the same parent IDs. The server must validate the complete parent-child chain and calculate shipping fees before creating the order.

A simple API response should look like this:

```json
{
  "data": [
    {
      "id": "47",
      "division_id": "6",
      "name": "Dhaka",
      "bn_name": "ঢাকা"
    }
  ]
}
```

## Sample valid payload

```json
{
  "division_id": "6",
  "district_id": "47",
  "upazila_id": "365",
  "union_id": "3271",
  "postcode": "1206",
  "address_line": "House 10, Road 2",
  "recipient_name": "Sample Customer",
  "phone": "+8801700000000"
}
```

The IDs are strings because they match the source exports. The Python package accepts either strings or integers as filter arguments.

## Production checklist

- Serve the frontend over HTTPS.
- Validate every selected ID on the backend.
- Check that the postcode belongs to the selected district.
- Apply courier serviceability and shipping rules on the backend.
- Save location names as an order snapshot.
- Do not use names as database join keys.
- Do not expose private order or customer data in frontend JSON.
- Pin the PyPI package version.

For the full explanation, read the [Ecommerce Checkout and API Guide](../../ECOMMERCE_API_GUIDE.md).
