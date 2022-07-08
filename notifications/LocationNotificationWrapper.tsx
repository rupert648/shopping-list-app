import React, { useEffect, useState } from 'react';
import { 
    addNotificationReceivedListener,
    addNotificationResponseReceivedListener,
    Notification as ExpoNotification,
    removeNotificationSubscription,
} from 'expo-notifications';
import { Subscription } from 'expo-modules-core';

import { registerForPushNotificationsAsync } from '../helpers/Notifications'
import { setupBackgroundTask, registerBackgroundFetchAsync } from '../helpers/BackgroundTasks';

interface LocationNotificationWrapperProps {
    children: React.ReactNode
}

export default function LocationNotificationWrapper({ children }: LocationNotificationWrapperProps) {
    const [expoPushToken, setExpoPushToken] = useState<string>('');
    const [notification, setNotification] = useState<ExpoNotification>();
    let _onReceivedListener: Subscription | undefined;
    let _onResponseReceivedListener: Subscription | undefined;


    useEffect(() => {
        const setupNotifications = async () => {
            // async request for token access
            try {
                const token = await registerForPushNotificationsAsync();
                setExpoPushToken(token);

                // reset task manager with new token
                setupBackgroundTask(expoPushToken);

                // restart background service
                registerBackgroundFetchAsync();
                
            } catch (Error) {
                // TODO: error handling
            }

            // This listener is fired whenever a notification is received while the app is foregrounded
            _onReceivedListener = addNotificationReceivedListener(notification => {
                // TODO: something with this? maybe show nearest location to user
                setNotification(notification);
            });

            // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
            _onResponseReceivedListener = addNotificationResponseReceivedListener(response => {
                // TODO: not much really, probably just show them their shopping list
                console.log(response);
            });

            return () => {
                if (_onReceivedListener)
                    removeNotificationSubscription(_onReceivedListener);
                if (_onResponseReceivedListener)
                    removeNotificationSubscription(_onResponseReceivedListener);
            };
        }
        
        setupNotifications();
    }, []);

    // update the background task to run with the expoPushToken
    // need to update this task each time it changes
    useEffect(() => {
        const updateBackground = async () => {
            if (!expoPushToken) return;

            // reset task manager with new token
            setupBackgroundTask(expoPushToken);

            // restart background service
            registerBackgroundFetchAsync();
        }
        
        updateBackground();

    }, [expoPushToken])

    return (
        <>
            {children}
        </>
    )
}