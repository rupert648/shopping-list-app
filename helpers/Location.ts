import supermarketData from '../data/SupermarketsUK.json';
import { LocationObject } from 'expo-location';

import { SuperMarketDto } from '../constants/Dtos';

const EARTH_RADIUS = 6371e3;

export type SimpleLocation = { latitude: number, longitude: number };

/**
 * Uses the stored list of supermarket locations to discover the closest supermarket, given the users current location.
 * @param userLocation the current location of the user.
 * @returns The closest supermarket object + the distance between the user and that supermarket.
 */
export async function getClosestSupermarketDistance(userLocation: LocationObject): Promise<SuperMarketDto & { distance: number }> {   
    // iterate through all locations and find closest
    try {
        const dataTransformed = supermarketData as Array<SuperMarketDto>;

        let closest: SuperMarketDto = dataTransformed[0];
        let closestDistance = calculateDistance(userLocation, closest);

        dataTransformed.forEach(supermarket => {
            const distance = calculateDistance(userLocation, supermarket);

            if (distance < closestDistance) {
                closestDistance = distance;
                closest = supermarket;
            }
        })

        return {
            ...closest,
            distance: closestDistance
        };

    } catch {
        return Promise.reject("error reading supermarket data");
    }
}

/**
 * Calculates the distance of the user from a given supermarket, returning the result in **metres**
 * @param userLocation the users current location returned by expo-location
 * @param supermarket a given supermarket.
 */
export function calculateDistance(userLocation: LocationObject, supermarket: SuperMarketDto): number {
    const { coords: { latitude: userLat, longitude: userLong } } = userLocation;
    const supermarketLat = parseFloat(supermarket.LAT);
    const supermarketLong = parseFloat(supermarket.LON);

    // long and lat NOT 2D vectors - cannot use 2D vector distance (pythag)
    // user haversine formula
    const theta1 = userLat * Math.PI/180 // in radians
    const theta2 = supermarketLat * Math.PI/180 // in radis

    const deltaTheta = (supermarketLat - userLat) * Math.PI/180;
    const deltaLambda = (supermarketLong - userLong) * Math.PI/180;

    const a = Math.sin(deltaTheta / 2) * Math.sin(deltaTheta / 2) +
                Math.cos(theta1) *  Math.cos(theta2) * 
                Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const distance = EARTH_RADIUS * c; // returns value in metres

    return distance;
}

export function coordinateToRadians(location: SimpleLocation): { longitude: number, latitude: number } {
    const latRad = location.latitude * Math.PI / 180;
    const lonRad = location.longitude * Math.PI / 180;

    return {latitude: latRad, longitude: lonRad}
}

export function coordinateToCartesian(location: SimpleLocation): { x: number, y: number, z: number } {
    const x = Math.cos(location.latitude) * Math.cos(location.longitude);
    const y = Math.cos(location.latitude) * Math.sin(location.longitude);
    const z = Math.sin(location.latitude);

    return {x, y, z}
}

/**
 * Calculates the Geographic midpoint betweeen two given coordinates on the Earths Surface, returning the midpoint.
 * method taken from first description in this article http://www.geomidpoint.com/calculation.html
 * this is definitely overkill for our purposes - a simple average of the coordinates would likely suffice
 * but is interesting to investigate nonetheless
 * @param location1 The first location
 * @param location2 the second location
 */
export function coordinatesMidpoint(location1: SimpleLocation, location2: SimpleLocation): SimpleLocation {
    // convert all lat/long into radians
    const location1Rad = coordinateToRadians(location1);
    const location2Rad = coordinateToRadians(location2);

    // convert all lat/lon to Cartesian coordinates
    const { x: x1, y: y1, z: z1} = coordinateToCartesian(location1Rad);
    const { x: x2, y: y2, z: z2} = coordinateToCartesian(location2Rad);

    // for our purposes we just take average of each coord, since each location is equally weighted
    const x = (x1 + x2) / 2;
    const y = (y1 + y2) / 2;
    const z = (z1 + z2) / 2;

    // convert these new coords back into lat/lon
    let lon = Math.atan2(y, x);
    const hyp = Math.sqrt(x*x + y*y);
    let lat = Math.atan2(z, hyp);

    // convert back to degrees
    lon = lon * 180 / Math.PI;
    lat = lat * 180 / Math.PI;

    return {
        latitude: lat,
        longitude: lon,
    }
}

