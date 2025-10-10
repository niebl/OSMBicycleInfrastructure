import fetch from "node-fetch";
import osmtogeojson from "osmtogeojson";
import { writeFile } from "fs";

import { ENDPOINT_BI as ENDPOINT_BI_MS } from "./bicycleinfrastructureHelpers/overpassQueryBI.js";
import { ENDPOINT_NW as ENDPOINT_NW_MS } from "./bicycleinfrastructureHelpers/overpassQueryNW.js";
import { ENDPOINT_AA as ENDPOINT_AA_MS } from "./bicycleinfrastructureHelpers/overpassQueryAA.js";

import { ENDPOINT_BI as ENDPOINT_BI_OS } from "./queries_OS/overpassQueryBI.js";
import { ENDPOINT_NW as ENDPOINT_NW_OS } from "./queries_OS/overpassQueryNW.js";
import { ENDPOINT_AA as ENDPOINT_AA_OS } from "./queries_OS/overpassQueryAA.js";

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
  try {
    // appraoch API for Bicycle Infrastructure (BI) Data
    console.log("start API-Request BI data...");
    let responseBi = await fetch(ENDPOINT_BI);
    if (!responseBi.ok) {
      throw new Error(`BI API request failed: ${responseBi.status} ${responseBi.statusText}`);
    }
    let dataBi;
    try {
      dataBi = await responseBi.json();
    } catch (e) {
      throw new Error(`Invalid JSON response for BI: ${e.message}`);
    }
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
    if (!responseNw.ok) {
      throw new Error(`NW API request failed: ${responseNw.status} ${responseNw.statusText}`);
    }
    let dataNw;
    try {
      dataNw = await responseNw.json();
    } catch (e) {
      throw new Error(`Invalid JSON response for NW: ${e.message}`);
    }
    console.log("finished API-Request NW data...");
    // append NW data to BI data
    console.log("start preprocessing NW data...");
    let geojsonNw = osmtogeojson(dataNw);
    geojsonBiType = appendNWtoBI(geojsonNw, geojsonBiType);
    console.log("finished preprocessing NW data...");

    // approach Overpass-API for Administrative Area (AA) Data
    console.log("start API-Request AA data...");
    let responseAa = await fetch(ENDPOINT_AA);
    if (!responseAa.ok) {
      throw new Error(`AA API request failed: ${responseAa.status} ${responseAa.statusText}`);
    }
    let dataAa;
    try {
      dataAa = await responseAa.json();
    } catch (e) {
      throw new Error(`Invalid JSON response for AA: ${e.message}`);
    }
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
  } catch (error) {
    console.error(`Error in getOSM for ${FILENAME}:`, error.message);
    console.log("Skipping file write due to error. Previous valid file (if any) will remain.");
  }
}

// run first time
getOSM(ENDPOINT_BI_MS, ENDPOINT_NW_MS, ENDPOINT_AA_MS, "./out/bicycleinfrastructure_MS");
getOSM(ENDPOINT_BI_OS, ENDPOINT_NW_OS, ENDPOINT_AA_OS, "./out/bicycleinfrastructure_OS");

// create cron job
cron.schedule( '0 */6 * * *', () => {
  getOSM(ENDPOINT_BI_MS, ENDPOINT_NW_MS, ENDPOINT_AA_MS, "./out/bicycleinfrastructure_MS");
  getOSM(ENDPOINT_BI_OS, ENDPOINT_NW_OS, ENDPOINT_AA_OS, "./out/bicycleinfrastructure_OS");
})


// const app = express();
// const OUT_DIR = path.join(__dirname, "out"); // always points to ./out next to your script

// // Ensure out folder exists
// if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// // --- Serve files via HTTP ---
// app.get("/bicycleinfrastructure_MS", (req, res) => {
//   const filePath = path.join(OUT_DIR, "bicycleinfrastructure_MS.geojson");
//   if (fs.existsSync(filePath)) res.sendFile(filePath);
//   else res.status(404).send("File not found");
// });

// app.get("/bicycleinfrastructure_OS", (req, res) => {
//   const filePath = path.join(OUT_DIR, "bicycleinfrastructure_OS.geojson");
//   if (fs.existsSync(filePath)) res.sendFile(filePath);
//   else res.status(404).send("File not found");
// });

// app.listen(3001, () => console.log("Serving GeoJSON on port 3001"));

// // --- Function to fetch and update file safely ---
// async function updateOSMFile(ENDPOINT_BI, ENDPOINT_NW, ENDPOINT_AA, filename) {
//   const filePath = path.join(OUT_DIR, `${filename}.geojson`);
//   const tempPath = path.join(OUT_DIR, `${filename}.geojson.tmp`);

//   try {
//     // Fetch BI
//     const dataBi = await fetch(ENDPOINT_BI).then(r => r.json());
//     let geojsonBi = osmtogeojson(dataBi);
//     geojsonBi = addBikeInfrastructureType(geojsonBi);
//     geojsonBi = duplicatePolygonsToPoints(geojsonBi);
//     geojsonBi = duplicateTrafficCalming(geojsonBi);
//     geojsonBi = splitTrafficSignalLines(geojsonBi);
//     geojsonBi = addAttributes(geojsonBi);

//     // Fetch NW
//     const dataNw = await fetch(ENDPOINT_NW).then(r => r.json());
//     const geojsonNw = osmtogeojson(dataNw);
//     geojsonBi = appendNWtoBI(geojsonNw, geojsonBi);

//     // Fetch AA
//     const dataAa = await fetch(ENDPOINT_AA).then(r => r.json());
//     const geojsonAa = osmtogeojson(dataAa);
//     geojsonBi = aggregateBiAdminArea(geojsonAa, geojsonBi);

//     // Simplify
//     geojsonBi = simplifyGeoJSON(geojsonBi, 0.0001, true);

//     // Write atomically
//     fs.writeFileSync(tempPath, JSON.stringify(geojsonBi));
//     fs.renameSync(tempPath, filePath);
//     console.log(`Successfully updated ${filePath} (${geojsonBi.features.length} features)`);
//   } catch (err) {
//     console.error(`⚠ Failed to update ${filename}:`, err.message);
//     if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
//     console.log("Using existing file if available.");
//   }
// }

// // --- Cron job every 6 hours ---
// cron.schedule("0 */6 * * *", () => {
//   console.log("\n Scheduled OSM update running...");
//   updateOSMFile(ENDPOINT_BI_MS, ENDPOINT_NW_MS, ENDPOINT_AA_MS, "bicycleinfrastructure_MS");
//   updateOSMFile(ENDPOINT_BI_OS, ENDPOINT_NW_OS, ENDPOINT_AA_OS, "bicycleinfrastructure_OS");
// });

// // --- Optional: fetch immediately on start to ensure file exists ---
// (async () => {
//   await updateOSMFile(ENDPOINT_BI_MS, ENDPOINT_NW_MS, ENDPOINT_AA_MS, "bicycleinfrastructure_MS");
//   await updateOSMFile(ENDPOINT_BI_OS, ENDPOINT_NW_OS, ENDPOINT_AA_OS, "bicycleinfrastructure_OS");
// })();