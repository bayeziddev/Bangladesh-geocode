# Bangladesh Geocode Developer Guide

This guide explains how to work on the Bangladesh Geocode repository, use its data exports, develop the Python package, run validation locally, and publish a release to PyPI. The project is an offline data distribution. It does not run a web service and it does not require API credentials at runtime.

For ecommerce checkout integration, cascading address selectors, postal-code lookup, custom REST endpoints, and backend validation examples, see the [Ecommerce and API Guide](ECOMMERCE_API_GUIDE.md).

## Project scope

The repository contains Bangladesh administrative geography at four levels:

| Level | Records | Parent key |
| --- | ---: | --- |
| Division | 8 | — |
| District | 64 | `division_id` |
| Upazila | 494 | `district_id` |
| Union | 4,540 | `upazila_id` |

Each level is available as CSV, JSON, SQL, PHP, and XML where the corresponding export exists. Bangladesh postal-code data is available in `postcode-bd/` as bilingual JSON and English/Bengali CSV exports. District boundary polygons are distributed as a 64-feature GeoJSON `FeatureCollection` in `geojson/districts.geojson.txt`.

## Repository layout

The top-level data directories are the source exports used by web, database, and scripting projects. The `src/bangladesh_geo_data` directory contains the Python package. Its `data` directory contains the JSON and GeoJSON snapshot bundled into Python wheels and source distributions. The `tests` directory contains package-level regression tests. The HTML files and `assets` directory make up the GitHub Pages developer site.

```text
.
├── divisions/                         Division exports
├── districts/                         District exports and coordinates
├── upazilas/                          Upazila exports
├── unions/                            Union exports
├── postcode-bd/                       Postal-code exports
├── geojson/districts.geojson.txt      Complete district boundaries
├── src/bangladesh_geo_data/            Python package
│   ├── __init__.py                     Public API exports
│   ├── data.py                         Resource loading and filters
│   └── data/                            Bundled data snapshot
├── tests/test_data.py                  Package regression tests
├── pyproject.toml                      Build and package metadata
└── .github/workflows/pypi.yml          Build, test, and release pipeline
```

## Local development

Use Python 3.9 or newer. A virtual environment keeps build tools separate from the system interpreter.

```bash
git clone https://github.com/bayeziddev/Bangladesh-geocode.git
cd Bangladesh-geocode
python -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install --editable ".[dev]"
pytest
```

The project currently has no runtime dependencies. The editable install is useful because it tests the same `src` layout used by the release build.

## Python package API

The distribution name on PyPI is `bangladesh-geo-data`. The import name is `bangladesh_geo_data` because Python module names use underscores.

```python
from bangladesh_geo_data import (
    get_district_boundaries,
    get_districts,
    get_divisions,
    get_postcodes,
    get_unions,
    get_upazilas,
)

for division in get_divisions():
    print(division["id"], division["name"])

dhaka_districts = get_districts(division_id=6)
first_district_upazilas = get_upazilas(district_id=1)
first_upazila_unions = get_unions(upazila_id=1)
dhaka_cantonment = get_postcodes(1206)
geojson = get_district_boundaries()
```

The functions return new Python lists or dictionaries loaded from package resources. They do not contact the network. Source IDs remain strings for consistency with the repository JSON exports, although filter arguments accept either an integer or a string. The source union export contains the historical key `upazilla_id`; the Python API normalizes it to `upazila_id`.

### Function reference

| Function | Return value | Optional filter |
| --- | --- | --- |
| `get_divisions()` | List of division dictionaries | None |
| `get_districts(division_id=None)` | List of district dictionaries | `division_id` |
| `get_upazilas(district_id=None)` | List of upazila dictionaries | `district_id` |
| `get_unions(upazila_id=None)` | List of union dictionaries | `upazila_id` |
| `get_postcodes(postcode=None)` | Mapping of postal-code records | `postcode` |
| `get_district_boundaries()` | GeoJSON dictionary | None |

## Data contract

Names are available in `name` and `bn_name`. Parent relationships are represented by string foreign keys. District records also contain `lat` and `lon` as string values because that is how the source JSON is exported. Applications that perform numeric calculations should convert those fields to `float` at the application boundary.

Postal-code records are keyed by the source postcode and contain `en` and `bn` objects. Each language object includes `division`, `district`, `thana`, `suboffice`, and `postcode`. The source export can contain trailing whitespace in keys and values; `get_postcodes()` preserves the source record, while a filtered lookup compares a stripped postcode.

The complete GeoJSON file is a standard `FeatureCollection`. Each feature uses `MultiPolygon` geometry and includes district and division properties such as `ADM2_EN` and `ADM1_EN`. The file extension is `.txt` in the repository so it can be served directly by simple static hosts; the Python package exposes the same content as `districts.geojson`.

## Testing and build validation

Run the test suite and build both distribution formats before opening a release pull request.

```bash
pytest
python -m build
python -m twine check dist/*
```

The tests verify the expected record counts, parent filters, historical-key normalization, and the 64-feature boundary collection. The workflow repeats these checks on Ubuntu with Python 3.9 through 3.13.

## Release process

Update the version in `pyproject.toml` and `src/bangladesh_geo_data/__init__.py` together. Update the release notes or README when the public API or data contract changes. Commit the changes to `main`, then create and push a tag with the exact form below.

```bash
git tag bangladesh-geo-data-v0.1.0
git push origin main --follow-tags
```

The `pypi.yml` workflow runs tests and builds an artifact first. A tag matching `bangladesh-geo-data-v*` then publishes that exact artifact to PyPI. A manual run can build without publishing, or publish when its `publish` input is set to `true`.

The repository secret used by the token-based publisher is `PYPI_MY_PROJECT_TOKEN`. Its value must be a PyPI API token with permission to upload the `bangladesh-geo-data` project. The workflow never prints the secret. The `pypi` environment is used to make release settings visible and to allow repository-level protection rules if the maintainer adds them later.

For a new project, PyPI will create the project on the first successful upload. Every later upload must use a new version; PyPI rejects overwriting an existing filename.

## Troubleshooting the previous failure

The previous workflow failed before packaging because `pyproject.toml` declared `where = ["src"]`, but the repository did not contain a `src` directory or any Python package. The editable install therefore stopped with `error in 'egg_base' option: 'src' does not exist or is not a directory`.

A separate earlier workflow revision also tried to use `packages/bangladesh-geo-data` as its working directory even though that path did not exist. The corrected workflow runs at the repository root, creates the package from `src`, and builds from the same layout used by local development.

If the corrected build passes but publishing fails, check the following in order:

1. Confirm that the token is stored as the repository secret `PYPI_MY_PROJECT_TOKEN` and that it has upload permission for `bangladesh-geo-data`.
2. Confirm that the tag version matches the `version` field in `pyproject.toml`.
3. Confirm that the version has not already been uploaded. PyPI does not replace an existing release file.
4. Confirm that the repository `pypi` environment does not require an approval that is waiting in GitHub Actions.
5. Open the failed publish step and check whether the error is authentication, project ownership, or a duplicate version.

## Contribution workflow

Open an issue when a record appears incorrect and include the source used for comparison. For code or documentation changes, create a focused branch, run the full test and build commands, and open a pull request against `main`. Data changes should preserve parent IDs and update the JSON, CSV, SQL, PHP, and XML exports together whenever the same record is represented in each format.

The package and dataset are released under the MIT License. Contributions are accepted under the same terms.
