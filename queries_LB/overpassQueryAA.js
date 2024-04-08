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

export const ENDPOINT_AA =
  'https://overpass-api.de/api/interpreter?data=%5Bout%3Ajson%5D%3Barea%5B%22name%22=%22L%C3%BCbeck%22%5D%5B%22de%3Aplace%22=%22city%22%5D-%3E.searchArea%3B%28relation%5B%22name%22=%22%7Bcity%7D%22%5D%5B%22de%3Aplace%22=%22city%22%5D%3Brelation%5B%22admin_level%22=%229%22%5D%5B%22boundary%22%21%7E%22religious_administration%22%5D%5B%22name%22%21%7E%22Sereetz%22%5D%28area.searchArea%29%3B%29%3Bout%3B%3E%3E%3Bout+skel+qt%3B';

// PRETTY OVERPASS QL for administrative areas
/*
[out:json]
;
area
  ["name"="Lübeck"]
  ["de:place"="city"]
  ->.searchArea;
(
  relation
    ["name"="{city}"]
    ["de:place"="city"];
  relation
    ["admin_level"="9"]
  	["boundary"!~"religious_administration"]
  	["name"!~"Sereetz"]
    (area.searchArea);
);
out;
>>;
out skel qt;
*/