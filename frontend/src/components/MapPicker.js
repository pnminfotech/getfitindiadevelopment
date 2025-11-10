// components/MapPicker.js
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";

const LocationMarker = ({ setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return null;
};

export default function MapPicker({ position, setPosition }) {
  return (
    <div>
      <MapContainer center={position} zoom={13} style={{ height: "300px" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker setPosition={setPosition} />
        {position && <Marker position={position} />}
      </MapContainer>
    </div>
  );
}
