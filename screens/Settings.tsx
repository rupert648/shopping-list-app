import { useEffect, useState} from 'react';
import { StyleSheet } from 'react-native';
import * as Location from 'expo-location';

import { Text, View } from '../components/Themed';

export default function Settings() {
  const [location, setLocation] = useState<Location.LocationObject>();

  useEffect(() => {
    (async () => {
      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{JSON.stringify(location)}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
