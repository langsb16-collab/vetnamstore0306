import React from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { Shop } from '../types';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: 16.0471, // Center of Vietnam roughly
  lng: 108.2062
};

interface MapViewProps {
  shops: Shop[];
  onMarkerClick: (shop: Shop) => void;
}

const MapView: React.FC<MapViewProps> = ({ shops, onMarkerClick }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "" // In AI Studio, we often don't need a key for basic dev or it's provided via env
  });

  const [map, setMap] = React.useState<google.maps.Map | null>(null);

  const onLoad = React.useCallback(function callback(m: google.maps.Map) {
    setMap(m);
  }, []);

  const onUnmount = React.useCallback(function callback(m: google.maps.Map) {
    setMap(null);
  }, []);

  if (!isLoaded) return <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">Loading Map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={shops.length > 0 ? { lat: shops[0].latitude, lng: shops[0].longitude } : defaultCenter}
      zoom={6}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        styles: [
          {
            "featureType": "administrative",
            "elementType": "geometry",
            "stylers": [{ "visibility": "off" }]
          },
          {
            "featureType": "poi",
            "stylers": [{ "visibility": "off" }]
          },
          {
            "featureType": "road",
            "elementType": "labels.icon",
            "stylers": [{ "visibility": "off" }]
          },
          {
            "featureType": "transit",
            "stylers": [{ "visibility": "off" }]
          }
        ]
      }}
    >
      {shops.map((shop) => (
        <Marker
          key={shop.id}
          position={{ lat: shop.latitude, lng: shop.longitude }}
          onClick={() => onMarkerClick(shop)}
          title={shop.name}
        />
      ))}
    </GoogleMap>
  );
};

export default React.memo(MapView);
