/**
 * Reusable Bangladesh Geocode checkout helpers.
 *
 * The functions accept the repository's JSON export shape and work with either
 * the historical `upazilla_id` key or the normalized `upazila_id` key.
 */

export function records(value) {
  if (!Array.isArray(value)) return value;
  const table = value.find(item => Array.isArray(item?.data));
  return table ? table.data : value;
}

export function filterDistricts(value, divisionId) {
  return records(value).filter(
    item => String(item.division_id) === String(divisionId),
  );
}

export function filterUpazilas(value, districtId) {
  return records(value).filter(
    item => String(item.district_id) === String(districtId),
  );
}

export function filterUnions(value, upazilaId) {
  return records(value).filter(
    item => String(item.upazilla_id ?? item.upazila_id) === String(upazilaId),
  );
}

export function findPostcode(value, postcode) {
  const wanted = String(postcode).trim();
  const entry = Object.entries(value ?? {}).find(
    ([key]) => key.trim() === wanted,
  );
  return entry ? { key: entry[0], record: entry[1] } : null;
}

export function fillSelect(select, rows, placeholder) {
  select.replaceChildren(new Option(placeholder, ''));
  for (const row of rows) {
    select.add(new Option(row.name, row.id));
  }
  select.disabled = rows.length === 0;
}

/**
 * Connects four form controls to loaded datasets.
 * Returns a postcode validator so an application can call it on submit too.
 */
export function bindCheckoutAutocomplete({
  division,
  district,
  upazila,
  union,
  postcode,
  divisions,
  districts,
  upazilas,
  unions,
  postcodes,
  optionPlaceholder = 'Select an option',
}) {
  const divisionRows = records(divisions);
  const districtRows = records(districts);
  const upazilaRows = records(upazilas);
  const unionRows = records(unions);

  fillSelect(division, divisionRows, 'Select division');
  fillSelect(district, [], 'Select district');
  fillSelect(upazila, [], 'Select upazila');
  fillSelect(union, [], 'Select union');

  division.addEventListener('change', () => {
    fillSelect(
      district,
      filterDistricts(districtRows, division.value),
      'Select district',
    );
    fillSelect(upazila, [], 'Select upazila');
    fillSelect(union, [], 'Select union');
  });

  district.addEventListener('change', () => {
    fillSelect(
      upazila,
      filterUpazilas(upazilaRows, district.value),
      'Select upazila',
    );
    fillSelect(union, [], 'Select union');
  });

  upazila.addEventListener('change', () => {
    fillSelect(
      union,
      filterUnions(unionRows, upazila.value),
      'Select union',
    );
  });

  const validatePostcode = () => {
    const match = findPostcode(postcodes, postcode.value);
    postcode.setCustomValidity(match ? '' : 'Postcode not found');
    return match;
  };

  postcode.addEventListener('change', validatePostcode);
  return { validatePostcode };
}
