from bangladesh_geo_data import (
    get_district_boundaries,
    get_districts,
    get_divisions,
    get_postcodes,
    get_unions,
    get_upazilas,
)


def test_dataset_counts():
    assert len(get_divisions()) == 8
    assert len(get_districts()) == 64
    assert len(get_upazilas()) == 494
    assert len(get_unions()) == 4540


def test_parent_filters_accept_integers():
    assert all(row["division_id"] == "6" for row in get_districts(division_id=6))
    assert all(row["district_id"] == "1" for row in get_upazilas(district_id=1))
    assert all(row["upazila_id"] == "1" for row in get_unions(upazila_id=1))


def test_records_are_normalized():
    assert "upazila_id" in get_unions()[0]
    assert "upazilla_id" not in get_unions()[0]


def test_geojson_boundaries():
    boundaries = get_district_boundaries()
    assert boundaries["type"] == "FeatureCollection"
    assert len(boundaries["features"]) == 64


def test_postcodes_are_bilingual_and_filterable():
    postcodes = get_postcodes()
    assert len(postcodes) > 1_000
    result = get_postcodes(1206)
    assert len(result) == 1
    record = next(iter(result.values()))
    assert record["en"]["division"] == "Dhaka"
    assert "bn" in record
