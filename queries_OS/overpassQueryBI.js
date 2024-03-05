/**
 * Smart City Münster Dashboard
 * Copyright (C) 2022 Reedu GmbH & Co. KG
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * To change something in the state, you need to dispatch an action.
 * An action is a plain JavaScript object (notice how we don’t
 * introduce any magic?) that describes what happened.
 * In our case we add a type to the action, so that the reducer can
 * refer to this action.type
 */

export const ENDPOINT_BI =
  'https://overpass-api.de/api/interpreter?data=[out:json];area["name"="Osnabrück"]["de:place"="city"]->.searchArea;(way[~"cycleway.*"~"^lane"](area.searchArea);way[~"cycleway.*"~"share"](area.searchArea);way["highway"~"cycleway"](area.searchArea);way["highway"]["bicycle"="designated"](area.searchArea);way[~"cycleway.*"~"track"](area.searchArea);way["highway"]["bicycle"~"(yes|permissive)"](area.searchArea);way["highway"="service"]["access"!="private"]["bicycle"="yes"](area.searchArea);way["highway"="service"]["access"!="private"]["oneway:bicycle"="no"](area.searchArea);node["crossing"="traffic_signals"]["bicycle"="yes"](area.searchArea);node["highway"="traffic_signals"]["bicycle"="yes"](area.searchArea);way["highway"="residential"](area.searchArea);way["highway"="living_street"]["bicycle"="yes"](area.searchArea);node["traffic_calming"](area.searchArea);node["ramp:bicycle"="yes"](area.searchArea);way["ramp:bicycle"="yes"](area.searchArea);node["ramp:stroller"="yes"](area.searchArea);way["ramp:stroller"="yes"](area.searchArea);way["cyclestreet"="yes"](area.searchArea);way["bicycle_road"="yes"](area.searchArea);way[".*name"~"Promenade"](area.searchArea);way[~"cycleway"~"opposite"](area.searchArea);way["oneway"="yes"]["oneway:bicyle"="no"](area.searchArea);node[~"cycleway.*"~"asl"](area.searchArea);way[~"cycleway.*"~"asl"](area.searchArea);node["amenity"~"bicycle_parking"](area.searchArea);way["amenity"~"bicycle_parking"](area.searchArea);node["amenity"="charging_station"]["bicycle"="yes"](area.searchArea);way["amenity"="charging_station"]["bicycle"="yes"](area.searchArea);node["amenity"="charging_station"]["description"~"[Bb]ike"](area.searchArea);way["amenity"="charging_station"]["description"~"[Bb]ike"](area.searchArea);node["shop"="bicycle"](area.searchArea);way["shop"="bicycle"](area.searchArea);node["amenity"="bicycle_rental"](area.searchArea);way["amenity"="bicycle_rental"](area.searchArea);node["amenity"="bicycle_repair_station"](area.searchArea);node["vending"="bicycle_tube"](area.searchArea);node["information"]["information"!="board"]["bicycle"="yes"](area.searchArea);node["public_transport"="station"]["railway"~"(halt|station)"](area.searchArea);node["highway"="bus_stop"](area.searchArea););out;>;out skel qt;';
// PRETTY OVERPASS QL for the bicycle infrastructure BI
/*
[out:json];
area
  ["name"="Osnabrück"]
  ["de:place"="city"]
  ->.searchArea;
(
  way
    [~"cycleway.*"~"^lane"]
    (area.searchArea);
  way
    [~"cycleway.*"~"share"]
    (area.searchArea);
  way
    ["highway"~"cycleway"]
    (area.searchArea);
  way
    ["highway"]
    ["bicycle"="designated"]
    (area.searchArea);
  way
    [~"cycleway.*"~"track"]
    (area.searchArea);
  way
    ["highway"]
    ["bicycle"~"(yes|permissive)"]
    (area.searchArea);
  way
    ["highway"="service"]
    ["access"!="private"]
    ["bicycle"="yes"]
    (area.searchArea);
  way
    ["highway"="service"]
    ["access"!="private"]
    ["oneway:bicycle"="no"]
    (area.searchArea);
  node
    ["crossing"="traffic_signals"]
    ["bicycle"="yes"]
    (area.searchArea);
  node
    ["highway"="traffic_signals"]
    ["bicycle"="yes"]
    (area.searchArea);
  way
    ["highway"="residential"]
    (area.searchArea);
  way
    ["highway"="living_street"]
    ["bicycle"="yes"]
    (area.searchArea);
  node
    ["traffic_calming"]
    (area.searchArea);
  node
    ["ramp:bicycle"="yes"]
    (area.searchArea);
  way
    ["ramp:bicycle"="yes"]
    (area.searchArea);
  node
    ["ramp:stroller"="yes"]
    (area.searchArea);
  way
    ["ramp:stroller"="yes"]
    (area.searchArea);
  way
    ["cyclestreet"="yes"]
    (area.searchArea);
  way
    ["bicycle_road"="yes"]
    (area.searchArea);
  way
    [".*name"~"Promenade"]
    (area.searchArea);
  way
    [~"cycleway"~"opposite"]
    (area.searchArea);
  way
    ["oneway"="yes"]
    ["oneway:bicyle"="no"]
    (area.searchArea);
  node
    [~"cycleway.*"~"asl"]
    (area.searchArea);
  way
    [~"cycleway.*"~"asl"]
    (area.searchArea);
  node
    ["amenity"~"bicycle_parking"]
    (area.searchArea);
  way
    ["amenity"~"bicycle_parking"]
    (area.searchArea);
  node
    ["amenity"="charging_station"]
    ["bicycle"="yes"]
    (area.searchArea);
  way
    ["amenity"="charging_station"]
    ["bicycle"="yes"]
    (area.searchArea);
  node
    ["amenity"="charging_station"]
    ["description"~"[Bb]ike"]
    (area.searchArea);
  way
    ["amenity"="charging_station"]
    ["description"~"[Bb]ike"]
    (area.searchArea);
  node
    ["shop"="bicycle"]
    (area.searchArea);
  way
    ["shop"="bicycle"]
    (area.searchArea);
  node
    ["amenity"="bicycle_rental"]
    (area.searchArea);
  way
    ["amenity"="bicycle_rental"]
    (area.searchArea);
  node
    ["amenity"="bicycle_repair_station"]
    (area.searchArea);
  node
    ["vending"="bicycle_tube"]
    (area.searchArea);
  node
    ["information"]
    ["information"!="board"]
    ["bicycle"="yes"]
    (area.searchArea);
  node
    ["public_transport"="station"]
    ["railway"~"(halt|station)"]
    (area.searchArea);
  node["highway"="bus_stop"](area.searchArea);
);
out;
>;
out skel qt;
*/