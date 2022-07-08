import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { getCurrentPositionAsync } from 'expo-location';
import MapView, { Marker, Region } from 'react-native-maps';

import { getClosestSupermarketDistance } from '../../helpers/Location';
import { SuperMarketDto } from '../../constants/Dtos';

export default function NearestSuperMarketDisplay() {
  const [nearestSupermarket, setNearestSupermarket] = useState<SuperMarketDto & { distance: number }>();

  useEffect(() => {
    const getNearestSupermarket = async () => {
      const location = await getCurrentPositionAsync({});
      
      const result = await getClosestSupermarketDistance(location);
      
      console.log(result.LAT)
      console.log(result.LON);
      setNearestSupermarket(result);
    }

    getNearestSupermarket();
  }, []);

  const createRegionObject = (supermarket: SuperMarketDto & { distance: number }): Region => {
    return {
      latitude: parseFloat(supermarket.LAT),
      longitude: parseFloat(supermarket.LON),
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }

  const superMarketRegion = nearestSupermarket ? createRegionObject(nearestSupermarket) : undefined;  
 
  // TODO: spinner
  return (
    <View>
      <Text>{nearestSupermarket?.SUPERMARKET}</Text>
      <Text>{nearestSupermarket?.NAME}</Text>
      <Text>{nearestSupermarket?.distance}</Text>
      { nearestSupermarket &&
        <MapView 
          style={styles.map}
          region={superMarketRegion}
          showsUserLocation
        >
          <Marker coordinate={{
            latitude: parseFloat(nearestSupermarket.LAT),
            longitude: parseFloat(nearestSupermarket.LON)
          }} />
        </MapView>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 2,
  },
});
