import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet, ActivityIndicator } from 'react-native';
import { getCurrentPositionAsync, LocationObject } from 'expo-location';
import MapView, { Marker, Region } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

import { getClosestSupermarketDistance, coordinatesMidpoint, SimpleLocation } from '../../helpers/Location';
import { SuperMarketDto } from '../../constants/Dtos';

const apiKey = "AIzaSyBhxhGuUdPBBhD_hJBOkzH9yiLAdSqEo3g";

export default function NearestSuperMarketDisplay() {
  const [location, setLocation] = useState<LocationObject>();
  const [nearestSupermarket, setNearestSupermarket] = useState<SuperMarketDto & { distance: number }>();

  useEffect(() => {
    const getNearestSupermarket = async () => {
      const location = await getCurrentPositionAsync({});
      
      const result = await getClosestSupermarketDistance(location);
      
      setLocation(location);
      setNearestSupermarket(result);
    }

    getNearestSupermarket();
  }, []);

  const createRegionObject = (location1: SimpleLocation, location2: SimpleLocation): Region => {
    const locationMidpoint = coordinatesMidpoint(location1, location2);
    // padding ensures locations arent on edges of the map
    const padding = 0.01;

    return {
      latitude: locationMidpoint.latitude,
      longitude: locationMidpoint.longitude,
      latitudeDelta: Math.abs(location1.latitude - location2.latitude) + padding,
      longitudeDelta: Math.abs(location1.longitude - location2.longitude) + padding,
    };
  }

  // break out early if we haven't loaded supermarket yet
  if (!nearestSupermarket || !location) return (
    <View>
      <ActivityIndicator size={"large"} animating={!nearestSupermarket} />
    </View>
  )

  // cleaned location objects
  const nearestSupermarketSimpleLocation = {
    latitude: parseFloat(nearestSupermarket.LAT),
    longitude: parseFloat(nearestSupermarket.LON)
  };
  const locationSimpleLocation = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude
  };

  const region = createRegionObject(nearestSupermarketSimpleLocation, locationSimpleLocation);
  const actualDistance = nearestSupermarket ? `${(nearestSupermarket.distance / 1000).toFixed(1)} KM away` : "";

  return (
    <View>
      <View style={styles.textArea}>
        <Text style={styles.brandText}>{nearestSupermarket?.SUPERMARKET}</Text>
        <Text style={styles.lightText}>{nearestSupermarket?.NAME.toLowerCase()}</Text>
        <Text>{actualDistance}</Text>
      </View>
      <MapView 
        style={styles.map}
        region={region}
        showsUserLocation
      >
        {/* Marker to show location of the supermarket */}
        <Marker coordinate={nearestSupermarketSimpleLocation} />
        {/* Attempt to show directions */}
        {apiKey && 
          <MapViewDirections
            origin={locationSimpleLocation}
            destination={nearestSupermarketSimpleLocation}
            apikey={apiKey}
            strokeWidth={3}
            strokeColor={"orange"}
          /> 
        }
      </MapView>
    </View> 
  )
}

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width - 10,
    height: Dimensions.get('window').height / 2,
  },
  textArea: {
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 5,
    borderRadius: 10,
    borderColor: "grey",
    borderWidth: 1,
  },
  brandText: {
    fontWeight: "bold"
  },
  lightText: {
    fontWeight: '300'
  }
});
