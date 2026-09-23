# bangladesh-geo-data

Offline, dependency-free Python access to Bangladesh's administrative geography — **Division → District → Upazila → Union** — bilingual (English + বাংলা), with district coordinates and GeoJSON boundary polygons for mapping.

```bash
pip install bangladesh-geo-location-code
```

## Quick start

```python
import bangladesh-geo-location-code as bd

bd.get_divisions()                      # 8 divisions
bd.get_districts(division_id=6)         # districts in a given division
bd.get_upazilas(district_id=1)          # upazilas in a given district
bd.get_unions(upazila_id=1)             # unions in a given upazila
bd.get_district_boundaries()            # full GeoJSON FeatureCollection (64 districts)
```

Every record includes an `id`, its parent `*_id`, `name` (English), `bn_name` (বাংলা), and a government `url`. Districts additionally include `lat` / `lon`.

No network calls, no API keys — the dataset ships inside the package (~5,106 records).

## Why this exists

Most Bangladesh location pickers hardcode a handful of divisions and stop there. This package gives you the **full** hierarchy down to Union level, in native Python objects, ready for address forms, delivery-zone logic, or feeding straight into a mapping library (Leaflet, Folium, GeoPandas, deck.gl) via `get_district_boundaries()`.

## Data source & credit

The administrative dataset distributed in this package originates from the open **[bangladesh-geocode](https://github.com/bayeziddev/bangladesh-geocode)** project by **Sayad Md Bayezid Hosan **, compiled from `bangladesh.gov.bd`, Wikipedia, and Google Maps, and released under the MIT License. This package repackages that dataset for `pip install` and Python use. If this data helps you, please star the original repository too.

This package is maintained by [Sayad Md Bayezid Hosan](https://github.com/bayeziddev) as part of the [Bangladesh-geocode](https://github.com/bayeziddev/Bangladesh-geocode) project.

## Full documentation

[bayeziddev.github.io/Bangladesh-geocode](https://bayeziddev.github.io/Bangladesh-geocode/)

## License

MIT — see [LICENSE](https://github.com/bayeziddev/Bangladesh-geocode/blob/main/LICENSE).