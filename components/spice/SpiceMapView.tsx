import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Colors from '@/constants/Colors';
import { useColorScheme } from '../useColorScheme';

interface Location {
  latitude: number;
  longitude: number;
}

interface SpiceMapViewProps {
  storeLocation: Location;
  destinationLocation: Location;
  currentLocation?: Location;
}

export function SpiceMapView({ storeLocation, destinationLocation, currentLocation }: SpiceMapViewProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  // Map region centered between store and destination
  const region = {
    latitude: (storeLocation.latitude + destinationLocation.latitude) / 2,
    longitude: (storeLocation.longitude + destinationLocation.longitude) / 2,
    latitudeDelta: Math.abs(storeLocation.latitude - destinationLocation.latitude) * 2 + 0.05,
    longitudeDelta: Math.abs(storeLocation.longitude - destinationLocation.longitude) * 2 + 0.05,
  };

  const mapStyle = colorScheme === 'dark' ? darkMapStyle : [];

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map} 
        initialRegion={region}
        customMapStyle={mapStyle}
      >
        <Marker coordinate={storeLocation} title="Store" pinColor={colors.saffron} />
        <Marker coordinate={destinationLocation} title="Destination" pinColor={colors.cardamom} />
        {currentLocation && (
          <Marker coordinate={currentLocation} title="Delivery Partner" pinColor={colors.chili} />
        )}
        <Polyline
          coordinates={[storeLocation, destinationLocation]}
          strokeColor={colors.saffron}
          strokeWidth={4}
          lineDashPattern={[10, 10]}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

// A simple dark map style array for react-native-maps
const darkMapStyle = [
  {
    "elementType": "geometry",
    "stylers": [{"color": "#242f3e"}]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{"color": "#746855"}]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [{"color": "#242f3e"}]
  },
  // Add more styling to fit the dark theme perfectly
];