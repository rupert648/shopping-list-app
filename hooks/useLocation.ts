import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

export default function useCachedResources() {
  const [status, setStatus] = useState<Location.PermissionStatus>();

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      setStatus(status);
    })();
  }, []);

  return { status };
}
