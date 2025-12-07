import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import L from "leaflet";

interface LocationPickerProps {
  onSelectLocation: (lat: number, lng: number) => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ onSelectLocation }) => {
  const [position, setPosition] = useState<L.LatLng | null>(null);

  function LocationMarker() {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        onSelectLocation(e.latlng.lat, e.latlng.lng);
      },
    });

    return position ? <Marker position={position}></Marker> : null;
  }

  return (
    <MapContainer
      center={[37.7749, -122.4194]} // America (San Francisco)
      zoom={13}
      style={{ height: "300px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <LocationMarker />
    </MapContainer>
  );
};

export default LocationPicker;
