# bangladesh-geo-data

Offline, dependency-free Python access to Bangladesh's administrative geography: **Division → District → Upazila → Union**. The package includes bilingual English/Bengali records, district coordinates, and GeoJSON boundary polygons.

```bash
python -m pip install bangladesh-geo-data
```

## Quick start

```python
from bangladesh_geo_data import (
    get_district_boundaries,
    get_districts,
    get_divisions,
    get_postcodes,
    get_unions,
    get_upazilas,
)

get_divisions()                       # 8 divisions
get_districts(division_id=6)          # districts in a division
get_upazilas(district_id=1)            # upazilas in a district
get_unions(upazila_id=1)               # unions in an upazila
get_postcodes(1206)                    # bilingual records for a postcode
get_district_boundaries()              # GeoJSON FeatureCollection
```

Every administrative record includes an `id`, its parent ID where applicable, an English `name`, a Bengali `bn_name`, and a government `url`. District records additionally include `lat` and `lon`. IDs are returned as strings to match the source exports; filter arguments accept either strings or integers.

The package makes no network calls and needs no API key. All data is bundled locally, including 8 divisions, 64 districts, 494 upazilas, 4,540 unions, Bangladesh postal-code records, and 64 district boundary features.

## Data source and credit

This package distributes data from the open [Bangladesh Geocode](https://github.com/bayeziddev/Bangladesh-geocode) project by **Sayad Md Bayezid Hosan**. The repository describes the source material as Bangladesh government websites, Wikipedia, and Google Maps. The project is released under the MIT License.

## Full documentation

Read the [developer guide](DEVELOPER_GUIDE.md) in the repository or visit the [online documentation](https://bayeziddev.github.io/Bangladesh-geocode/).

## License

MIT. See the [LICENSE file](https://github.com/bayeziddev/Bangladesh-geocode/blob/main/LICENSE).
