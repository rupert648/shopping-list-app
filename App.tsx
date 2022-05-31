import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import useLocation from './hooks/useLocation';
import Navigation from './navigation';
import LocationNotificationWrapper from './notifications/LocationNotificationWrapper';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const { status } = useLocation();

  const locationAccessGranted = status === "granted";

  if (!isLoadingComplete || !locationAccessGranted) {
    return null;
  } else {
    return (
      <LocationNotificationWrapper>
        <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </SafeAreaProvider>
      </LocationNotificationWrapper>
    );
  }
}
