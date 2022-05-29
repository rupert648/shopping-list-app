import React from 'react';
import { ViewProps, SafeAreaView } from 'react-native';
import { View } from 'react-native';

interface ListItemWrapperProps {
    children: React.ReactNode
}

export default function ListItemWrapper({ children }: ListItemWrapperProps) {
    return (
        // custom styling to go here
        <SafeAreaView>
            { children }
        </SafeAreaView>
    )
}
