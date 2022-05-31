import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

export default function useLocation() {
  const [status, setStatus] = useState<Location.PermissionStatus>();

  // requests the user for permission to use location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      setStatus(status);
    })();
  }, []);

  return { status };
}
