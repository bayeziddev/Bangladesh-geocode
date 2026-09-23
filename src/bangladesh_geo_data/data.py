"""Public data access functions for the Bangladesh Geocode package."""

from __future__ import annotations

import json
from importlib import resources
from typing import Any

_DATA_FILES = {
    "divisions": "divisions.json",
    "districts": "districts.json",
    "upazilas": "upazilas.json",
    "unions": "unions.json",
    "postcodes": "postcodes.json",
}


def _read_json(filename: str) -> Any:
    path = resources.files("bangladesh_geo_data").joinpath("data", filename)
    return json.loads(path.read_text(encoding="utf-8"))


def _records(name: str) -> list[dict[str, Any]]:
    """Return data records, excluding phpMyAdmin export metadata."""
    result = []
    raw = _read_json(_DATA_FILES[name])
    items = raw
    if isinstance(raw, list):
        table = next((item for item in raw if isinstance(item, dict) and "data" in item), None)
        if table is not None:
            items = table["data"]
    for item in items:
        if not isinstance(item, dict) or "id" not in item:
            continue
        record = dict(item)
        # The source export spells this foreign key upazilla_id. The Python
        # API uses the standard upazila spelling while preserving all values.
        if "upazilla_id" in record:
            record["upazila_id"] = record.pop("upazilla_id")
        result.append(record)
    return result


def _matches(record: dict[str, Any], key: str, value: str | int | None) -> bool:
    return value is None or str(record.get(key)) == str(value)


def get_divisions() -> list[dict[str, Any]]:
    """Return all 8 divisions."""
    return _records("divisions")


def get_districts(division_id: str | int | None = None) -> list[dict[str, Any]]:
    """Return all districts, optionally filtered by ``division_id``."""
    return [r for r in _records("districts") if _matches(r, "division_id", division_id)]


def get_upazilas(district_id: str | int | None = None) -> list[dict[str, Any]]:
    """Return all upazilas, optionally filtered by ``district_id``."""
    return [r for r in _records("upazilas") if _matches(r, "district_id", district_id)]


def get_unions(upazila_id: str | int | None = None) -> list[dict[str, Any]]:
    """Return all unions, optionally filtered by ``upazila_id``."""
    return [r for r in _records("unions") if _matches(r, "upazila_id", upazila_id)]


def get_district_boundaries() -> dict[str, Any]:
    """Return the 64-district GeoJSON FeatureCollection as a dictionary."""
    return _read_json("districts.geojson")


def get_postcodes(postcode: str | int | None = None) -> dict[str, Any]:
    """Return bilingual postal-code records, optionally for one postcode.

    The source export uses keys with occasional trailing whitespace. Matching
    therefore compares stripped values and returns the original record shape.
    """
    records = _read_json(_DATA_FILES["postcodes"])
    if postcode is None:
        return records
    wanted = str(postcode).strip()
    return {
        key: value for key, value in records.items() if str(key).strip() == wanted
    }
