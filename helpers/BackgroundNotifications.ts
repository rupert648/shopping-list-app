import BackgroundFetch from "react-native-background-fetch"
import PushNotifaction from "react-native-push-notification";

import { getCurrentPositionAsync } from 'expo-location';

import { getClosestSupermarketDistance } from './Location';

function backgroundNotificationInit() {
    PushNotifaction.configure({
        onNotification: notification => console.log(notification),
        // permissions for IOS
        permissions: {
            alert: true,
            badge: true,
            sound: true,
        },
        popInitialNotification: true,
    })

    // TODO: more regular than 15 minute interval somehow
    BackgroundFetch.configure({
        minimumFetchInterval: 15,
    }, async taskId => {
        try {
            const location = await getCurrentPositionAsync({});

            const { SUPERMARKET: supermarketName, distance } = await getClosestSupermarketDistance(location);

            PushNotifaction.localNotification({
                title: "Shopping List",
                message: `Don't forget to check your shopping list for what you need to buy!\n Nearest shop: ${supermarketName}, ${distance} metres away.`,
                // TODO: mess with these values for perfect notification sound!
                playSound: true,
                soundName: 'default',
                vibrate: true,
                vibration: 1,
            })

        } catch (error) {
            console.log("error whilst getting location/supermarket")
        }

        // call finish upon task compeition;
        BackgroundFetch.finish(taskId);
    }, error => {
        console.error(`RNBackgroundFetch failed to start: ${error}`);
    })
}

export { backgroundNotificationInit }