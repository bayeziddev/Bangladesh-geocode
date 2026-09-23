import assert from 'node:assert/strict';
import test from 'node:test';
import {
  bindCheckoutAutocomplete,
  filterDistricts,
  filterUnions,
  filterUpazilas,
  findPostcode,
  records,
} from '../../assets/checkout-autofill.mjs';

class TestOption {
  constructor(label, value) {
    this.label = label;
    this.value = value;
  }
}

globalThis.Option = TestOption;

class FakeSelect {
  constructor() {
    this.options = [];
    this.disabled = false;
    this.value = '';
    this.listeners = new Map();
  }

  replaceChildren(...options) {
    this.options = options;
  }

  add(option) {
    this.options.push(option);
  }

  addEventListener(event, callback) {
    this.listeners.set(event, callback);
  }

  change(value) {
    this.value = String(value);
    this.listeners.get('change')?.();
  }
}

const divisions = [
  { type: 'header' },
  { type: 'table', data: [
    { id: '6', name: 'Dhaka', bn_name: 'ঢাকা' },
    { id: '1', name: 'Chattagram', bn_name: 'চট্টগ্রাম' },
  ] },
];
const districts = [
  { type: 'table', data: [
    { id: '47', division_id: '6', name: 'Dhaka' },
    { id: '1', division_id: '1', name: 'Comilla' },
  ] },
];
const upazilas = [
  { type: 'table', data: [
    { id: '365', district_id: '47', name: 'Savar' },
    { id: '1', district_id: '1', name: 'Debidwar' },
  ] },
];
const unions = [
  { type: 'table', data: [
    { id: '3271', upazilla_id: '365', name: 'Savar' },
    { id: '1', upazila_id: '1', name: 'Subil' },
  ] },
];
const postcodes = {
  '1206 ': { en: { district: 'Dhaka' }, bn: { district: 'ঢাকা' } },
};

test('unwraps phpMyAdmin export records', () => {
  assert.equal(records(divisions).length, 2);
  assert.equal(records(divisions)[0].name, 'Dhaka');
});

test('filters each cascade level by its parent ID', () => {
  assert.deepEqual(filterDistricts(districts, 6).map(row => row.id), ['47']);
  assert.deepEqual(filterUpazilas(upazilas, '47').map(row => row.id), ['365']);
  assert.deepEqual(filterUnions(unions, 365).map(row => row.id), ['3271']);
  assert.deepEqual(filterUnions(unions, 1).map(row => row.id), ['1']);
});

test('finds postcodes despite source whitespace', () => {
  assert.equal(findPostcode(postcodes, '1206').key, '1206 ');
  assert.equal(findPostcode(postcodes, '9999'), null);
});

test('binds dynamic division, district, upazila, union, and postcode controls', () => {
  const division = new FakeSelect();
  const district = new FakeSelect();
  const upazila = new FakeSelect();
  const union = new FakeSelect();
  const postcode = { value: '', validityMessage: '', listeners: new Map(), setCustomValidity(value) {
    this.validityMessage = value;
  }, addEventListener(event, callback) {
    this.listeners.set(event, callback);
  } };

  const binding = bindCheckoutAutocomplete({
    division, district, upazila, union, postcode,
    divisions, districts, upazilas, unions, postcodes,
  });

  assert.deepEqual(division.options.map(option => option.value), ['', '6', '1']);
  assert.equal(district.disabled, true);

  division.change('6');
  assert.deepEqual(district.options.map(option => option.value), ['', '47']);
  assert.equal(upazila.disabled, true);

  district.change('47');
  assert.deepEqual(upazila.options.map(option => option.value), ['', '365']);

  upazila.change('365');
  assert.deepEqual(union.options.map(option => option.value), ['', '3271']);

  postcode.value = '1206';
  assert.equal(binding.validatePostcode().key, '1206 ');
  assert.equal(postcode.validityMessage, '');

  postcode.value = '9999';
  assert.equal(binding.validatePostcode(), null);
  assert.equal(postcode.validityMessage, 'Postcode not found');
});
