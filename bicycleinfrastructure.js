import fetch from "node-fetch";
import osmtogeojson from "osmtogeojson";
import { writeFile } from "fs";

import { ENDPOINT_BI as ENDPOINT_BI_MS } from "./bicycleinfrastructureHelpers/overpassQueryBI.js";
import { ENDPOINT_NW as ENDPOINT_NW_MS } from "./bicycleinfrastructureHelpers/overpassQueryNW.js";
import { ENDPOINT_AA as ENDPOINT_AA_MS } from "./bicycleinfrastructureHelpers/overpassQueryAA.js";

import { ENDPOINT_BI as ENDPOINT_BI_OS } from "./queries_OS/overpassQueryBI.js";
import { ENDPOINT_NW as ENDPOINT_NW_OS } from "./queries_OS/overpassQueryNW.js";
import { ENDPOINT_AA as ENDPOINT_AA_OS } from "./queries_OS/overpassQueryAA.js";

import { ENDPOINT_BI as ENDPOINT_BI_LB } from "./queries_LB/overpassQueryBI.js";
import { ENDPOINT_NW as ENDPOINT_NW_LB } from "./queries_LB/overpassQueryNW.js";
import { ENDPOINT_AA as ENDPOINT_AA_LB } from "./queries_LB/overpassQueryAA.js";

import cron from 'node-cron'

import {
  addAttributes,
  addBikeInfrastructureType,
  aggregateBiAdminArea,
  appendNWtoBI,
  duplicatePolygonsToPoints,
  duplicateTrafficCalming,
  splitTrafficSignalLines,
} from "./bicycleinfrastructureHelpers/helperFunctions.js";
import { simplifyGeoJSON } from "./bicycleinfrastructureHelpers/simplify.js";

console.log("starting bicycle infrastructure fetch script")

async function getOSM(ENDPOINT_BI, ENDPOINT_NW, ENDPOINT_AA, FILENAME) {
  // appraoch API for Bicycle Infrastructure (BI) Data
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

  // appraoch API for Network (NW) Data
  console.log("start API-Request NW data...");
  let responseNw = await fetch(ENDPOINT_NW);
  let dataNw = await responseNw.json();
  console.log("finished API-Request NW data...");
  // append NW data to BI data
  console.log("start preprocessing NW data...");
  let geojsonNw = osmtogeojson(dataNw);
  geojsonBiType = appendNWtoBI(geojsonNw, geojsonBiType);
  console.log("finished preprocessing NW data...");

  // approach Overpass-API for Administrative Area (AA) Data
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

  // simplify all features
  console.log("simplifying data")
  geojsonBiType = simplifyGeoJSON(geojsonBiType, 0.0001, true) 

  // write data to GeoJSON file
  const geojsonBiTypeString = JSON.stringify(geojsonBiType);
  writeFile(FILENAME, geojsonBiTypeString, (err) => {
    if (err) {
      console.log("Error writing file", err);
    } else {
      console.log(`Successfully wrote file ${FILENAME}`);
    }
  });
}

// run first time

getOSM(ENDPOINT_BI_LB, ENDPOINT_NW_LB, ENDPOINT_AA_LB, "./out/bicycleinfrastructure_LB");
getOSM(ENDPOINT_BI_MS, ENDPOINT_NW_MS, ENDPOINT_AA_MS, "./out/bicycleinfrastructure_MS");
getOSM(ENDPOINT_BI_OS, ENDPOINT_NW_OS, ENDPOINT_AA_OS, "./out/bicycleinfrastructure_OS");

// create cron job
cron.schedule( '0 */6 * * *', () => {
  getOSM(ENDPOINT_BI_LB, ENDPOINT_NW_LB, ENDPOINT_AA_LB, "./out/bicycleinfrastructure_LB");
  getOSM(ENDPOINT_BI_MS, ENDPOINT_NW_MS, ENDPOINT_AA_MS, "./out/bicycleinfrastructure_MS");
  getOSM(ENDPOINT_BI_OS, ENDPOINT_NW_OS, ENDPOINT_AA_OS, "./out/bicycleinfrastructure_OS");
})