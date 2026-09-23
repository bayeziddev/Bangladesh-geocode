"""Minimal backend data example.

Install first:
    python -m pip install bangladesh-geo-data==0.1.0
"""

from bangladesh_geo_data import (
    get_districts,
    get_divisions,
    get_postcodes,
    get_unions,
    get_upazilas,
)


def validate_checkout_address(payload: dict) -> dict:
    division_id = str(payload["division_id"])
    district_id = str(payload["district_id"])
    upazila_id = str(payload["upazila_id"])
    union_id = str(payload["union_id"])
    postcode = str(payload["postcode"]).strip()

    divisions = {str(row["id"]): row for row in get_divisions()}
    if division_id not in divisions:
        raise ValueError("Invalid division")

    district = next(
        (row for row in get_districts(division_id) if str(row["id"]) == district_id),
        None,
    )
    if district is None:
        raise ValueError("District does not belong to division")

    upazila = next(
        (row for row in get_upazilas(district_id) if str(row["id"]) == upazila_id),
        None,
    )
    if upazila is None:
        raise ValueError("Upazila does not belong to district")

    union = next(
        (row for row in get_unions(upazila_id) if str(row["id"]) == union_id),
        None,
    )
    if union is None:
        raise ValueError("Union does not belong to upazila")

    postcode_records = get_postcodes(postcode)
    if not postcode_records:
        raise ValueError("Postcode not found")
    postcode_area = next(iter(postcode_records.values()))["en"]
    if postcode_area["district"].strip() != district["name"].strip():
        raise ValueError("Postcode does not belong to district")

    return {
        "division_id": division_id,
        "district_id": district_id,
        "upazila_id": upazila_id,
        "union_id": union_id,
        "postcode": postcode,
        "shipping_fee_bdt": 80,
        "serviceable": True,
    }


if __name__ == "__main__":
    sample = {
        "division_id": "6",
        "district_id": "47",
        "upazila_id": "365",
        "union_id": "3271",
        "postcode": "1206",
    }
    print(validate_checkout_address(sample))
