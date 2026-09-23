"""Offline Bangladesh administrative geography data.

The package ships the repository's JSON datasets and district GeoJSON boundary
file so applications can use them without network access.
"""

from .data import (
    get_district_boundaries,
    get_districts,
    get_divisions,
    get_postcodes,
    get_unions,
    get_upazilas,
)

__all__ = [
    "get_divisions",
    "get_districts",
    "get_upazilas",
    "get_unions",
    "get_postcodes",
    "get_district_boundaries",
]

__version__ = "0.1.0"
