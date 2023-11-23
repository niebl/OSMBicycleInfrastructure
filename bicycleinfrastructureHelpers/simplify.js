import simplify from 'simplify-js'

export function simplifyGeoJSON(geojson, tolerance=1, highQuality=true){
    for (let feature of geojson.features){
        if(feature.geometry.type === "LineString"){
            feature.geometry.coordinates = simplifyLinestring(feature.geometry.coordinates, tolerance, highQuality)
        }
        else if(feature.geometry.type === "MultiLineString"){
            for (let array in feature.geometry.coordinates){
                feature.geometry.coordinates[array] = 
                    simplifyLineString(feature.geometry.coordinates[array])
            }
        }
        else if(feature.geometry.type === "Polygon"){
            feature.geometry.coordinates = simplifyPolygon(feature.geometry.coordinates, tolerance, highQuality)
        }
        else if(feature.geometry.type === "Multipolygon"){
            for (let i in feature.geometry.coordinates){
                feature.geometry.coordinates[i] = simplifyPolygon(feature.geometry.coordinates[i], tolerance, highQuality)
            }
        }
    }

    return geojson
}

function simplifyLinestring(array, tolerance, highQuality){
    let pointArray = []
    for(let point of array){
        //console.log(point)
        pointArray.push({y: point[0], x: point[1]})
    }
    pointArray = simplify(pointArray, tolerance, highQuality)

    return pointArray.map((point) => [point.y, point.x])
}

function simplifyPolygon(poly, tolerance, highQuality){
    for (let i in poly){
        poly[i] = simplifyLinestring(poly[i], tolerance, highQuality)
    }
    return poly
}