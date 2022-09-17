import fetch from "node-fetch";
import osmtogeojson from "osmtogeojson";
import { writeFile } from "fs";

import { ENDPOINT_BI } from "./bicycleinfrastructureHelpers/overpassQueryBI.js";
import { ENDPOINT_NW } from "./bicycleinfrastructureHelpers/overpassQueryNW.js";
import { ENDPOINT_AA } from "./bicycleinfrastructureHelpers/overpassQueryAA.js";
import {
  addAttributes,
  addBikeInfrastructureType,
  aggregateBiAdminArea,
  appendNWtoBI,
  duplicatePolygonsToPoints,
  duplicateTrafficCalming,
  splitTrafficSignalLines,
} from "./bicycleinfrastructureHelpers/helperFunctions.js";

async function getOSM(ENDPOINT_BI, ENDPOINT_NW, ENDPOINT_AA) {
  // appraoch API BI
  console.log("start API-Request BI data...");
  let responseBi = await fetch(ENDPOINT_BI);
  let dataBi = await responseBi.json();
  console.log("finished API-Request BI data...");

  console.log("start preprocessing BI data...");
  let geojsonBi = osmtogeojson(dataBi);
  // categorize data by BI types
  let geojsonBiType = addBikeInfrastructureType(geojsonBi);
  // duplicate Polygons to Points
  geojsonBiType = duplicatePolygonsToPoints(geojsonBiType);
  // duplicate overwritten traffic calmed ways
  geojsonBiType = duplicateTrafficCalming(geojsonBiType);
  // split Traffic Signal LineStrings
  geojsonBiType = splitTrafficSignalLines(geojsonBiType);
  // add attributes for every Feature
  geojsonBiType = addAttributes(geojsonBiType);
  console.log("finished preprocessing BI data...");

  // appraoch API NW
  console.log("start API-Request NW data...");
  let responseNw = await fetch(ENDPOINT_NW);
  let dataNw = await responseNw.json();
  console.log("finished API-Request NW data...");
  // append NW data to BI data
  console.log("start preprocessing NW data...");
  let geojsonNw = osmtogeojson(dataNw);
  geojsonBiType = appendNWtoBI(geojsonNw, geojsonBiType);
  console.log("finished preprocessing NW data...");

  // approach API AA
  console.log("start API-Request AA data...");
  let responseAa = await fetch(ENDPOINT_AA);
  let dataAa = await responseAa.json();
  console.log("finish API-Request AA data");
  // preprocessing AA
  console.log("start preprocessing AA data...");
  let geojsonAa = osmtogeojson(dataAa);
  console.log("Calculate parking, cycling, service data for admin areas...");
  geojsonBiType = aggregateBiAdminArea(geojsonAa, geojsonBiType);
  console.log("Calculation completed!");

  // write data to GeoJSON file
  const geojsonBiTypeString = JSON.stringify(geojsonBiType);
  writeFile("./bicycleinfrastructure.geojson", geojsonBiTypeString, (err) => {
    if (err) {
      console.log("Error writing file", err);
    } else {
      console.log("Successfully wrote file");
    }
  });
}

// Execute Function
getOSM(ENDPOINT_BI, ENDPOINT_NW, ENDPOINT_AA);
