# OSMBicycleInfrastructure
This repository contains a workflow for retrieving bicycle infrastructure from OSM and saving it as a categorized GeoJSON Feature Collection. 
The main file bicycleinfrastructure.js request OSM data from the Overpass-API using three helper files containing the request that was written in Overpass Query Language (https://wiki.openstreetmap.org/wiki/Overpass_API/Overpass_QL):
- Bicycle Infrastructure: bicycleinfrastructureHelpers/oerpassQueryBI.js
- Cyling Network: bicycleinfrastructureHelpers/oerpassQueryNW.js
- Administrative Areas: bicycleinfrastructureHelpers/oerpassQueryAA.js

Within the main file bicycleinfrastructure.js the retrieved data can be processed in two ways:
1. Optional - Spatially (e.g. duplication of Polygons (parking areas) to Points for a better interactive visualization)
2. Always - Thematically (e.g. categorization into bicycle infrastructure type and data cleaning of attributes)

Finally all data is written into a single GeoJSON with the type "FeatureCollection".
