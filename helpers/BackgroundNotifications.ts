import BackgroundFetch from "react-native-background-fetch"
import PushNotifaction from "react-native-push-notification";

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
        console.log(`background fetch event: ${taskId}`);

        // TODO: data task
        const data = 0;
        if (data <= 0) {
            PushNotifaction.localNotification({
                title: "Shopping List",
                message: "Don't forget to check your shopping list for what you need to buy!",
                // TODO: mess with these values for perfect notification sound!
                playSound: true,
                soundName: 'default',
                vibrate: true,
                vibration: 1,
            })
        }

        // call finish upon task compeition;
        BackgroundFetch.finish(taskId);
    }, error => {
        console.error(`RNBackgroundFetch failed to start: ${error}`);
    })
}

export { backgroundNotificationInit }