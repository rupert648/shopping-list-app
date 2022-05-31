import React, { useEffect } from 'react';

import { backgroundNotificationInit } from '../helpers/BackgroundNotifications'

interface LocationNotificationWrapperProps {
    children: React.ReactNode
}

export default function LocationNotificationWrapper({ children }: LocationNotificationWrapperProps) {

    useEffect(() => {
        // init the notifications
        backgroundNotificationInit();
    }, []);

    // handle notifications in here
    return (
        <>
            {children}
        </>
    )
}