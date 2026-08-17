import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin } from 'lucide-react';

// Fix for default marker icons in Leaflet with Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Component to handle clicks on map
function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position} />
  );
}

// Component to handle map resize bug when rendered in a modal
function MapResizer() {
  const map = useMap();
  useEffect(() => {
    // A small delay ensures the container has its final dimensions before invalidating size
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);
  return null;
}

export default function MapPicker({ onLocationSelect }) {
  // Default center: Sofia, Bulgaria
  const defaultCenter = [42.6977, 23.3219];
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (position && onLocationSelect) {
      onLocationSelect(position);
    }
  }, [position, onLocationSelect]);

  return (
    <div className="relative w-full h-48 border-2 border-border bg-secondary overflow-hidden">
      <MapContainer 
        center={defaultCenter} 
        zoom={12} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        attributionControl={false}
      >
        <MapResizer />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <LocationMarker position={position} setPosition={setPosition} />
      </MapContainer>
      
      {!position && (
        <div className="absolute bottom-2 left-2 z-[400] bg-background/90 border border-border px-3 py-1.5 flex items-center gap-2 pointer-events-none">
          <MapPin className="w-3 h-3 text-[#E85D4A]" />
          <span className="font-pixel text-[7px] text-foreground tracking-wider">CLICK MAP TO SET LOCATION</span>
        </div>
      )}
      
      {position && (
        <div className="absolute bottom-2 left-2 z-[400] bg-background/90 border border-[#C8E650] px-3 py-1.5 flex items-center gap-2 pointer-events-none">
          <MapPin className="w-3 h-3 text-[#C8E650]" />
          <span className="font-pixel text-[7px] text-[#C8E650] tracking-wider">
            {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
          </span>
        </div>
      )}
    </div>
  );
}
