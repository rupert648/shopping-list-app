import supermarketData from '../data/SupermarketsUK.json';
import { LocationObject } from 'expo-location';

import { SuperMarketDto } from '../constants/Dtos';

const EARTH_RADIUS = 6371e3;

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