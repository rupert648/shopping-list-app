import * as BackgroundFetch from 'expo-background-fetch';
import { getCurrentPositionAsync } from 'expo-location';
import * as TaskManager from 'expo-task-manager';

import { sendPushNotification } from './Notifications';
import { getClosestSupermarketDistance } from './Location';

const BACKGROUND_FETCH_TASK = 'location-grab';

// 1. Define the task by providing a name and the function that should be executed
// Note: This needs to be called in the global scope (e.g outside of your React components)
function setupBackgroundTask(expoPushToken: string) {
    TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
        try {
            const location = await getCurrentPositionAsync({});
    
            const { SUPERMARKET: supermarketName, distance } = await getClosestSupermarketDistance(location);
    
            const title = "Shopping List";
            const body = `Don't forget to check your shopping list for what you need to buy!\n Nearest shop: ${supermarketName}, ${distance} metres away.`;
            sendPushNotification(expoPushToken, title, body);
    
        } catch (error) {
            console.log("error whilst getting location/supermarket")
        }  
        // Be sure to return the successful result type!
        return BackgroundFetch.BackgroundFetchResult.NewData;
    });
}

// 2. Register the task at some point in your app by providing the same name, and some configuration options for how the background fetch should behave
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
async function registerBackgroundFetchAsync() {
    return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 60 * 15, // 15 minutes
      stopOnTerminate: false, // android only,
      startOnBoot: true, // android only
    });
}

export { setupBackgroundTask, registerBackgroundFetchAsync }