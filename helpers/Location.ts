import supermarketData from '../data/SupermarketsUK.json';
import * as Location from 'expo-location';

const EARTH_RADIUS = 6371e3;


// {
//     "SID": "1.000000000000000",
//     "LON": "-3.180560000000000",
//     "LAT": "55.936669999999900",
//     "NAME": "EDINBURGH CAUSEWAYSIDE EXPRESS",
//     "SUPERMARKET": "Tesco"
// }
interface SuperMarketDto {
    SID: string,
    LON: string,
    LAT: string,
    NAME: string,
    SUPERMARKET: string,
}

async function getClosestSupermarket(userLocation: Location.LocationObject): Promise<SuperMarketDto | null> {   
    let location = await Location.getCurrentPositionAsync({});

    // iterate through all locations and find closest
    try {
        const dataTransformed = supermarketData as Array<SuperMarketDto>;

        let closest: SuperMarketDto | null = null;
        let closestDistance = Number.MAX_VALUE;

        dataTransformed.forEach(supermarket => {
            const distance = calculateDistance(userLocation, supermarket);

            if (distance < closestDistance) {
                closestDistance = distance;
                closest = supermarket;
            }
        })

        return closest;

    } catch {
        return Promise.reject("error reading supermarket data");
    }
}

/**
 * Calculates the distance of the user from a given supermarket, returning the result in **metres**
 * @param userLocation the users current location returned by expo-location
 * @param supermarket a given supermarket.
 */
function calculateDistance(userLocation: Location.LocationObject, supermarket: SuperMarketDto): number {
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