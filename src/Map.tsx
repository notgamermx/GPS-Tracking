import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Map = () => {
  const kochiPosition: [number, number] = [10.0277, 76.3084];
  const [position, setPosition] = useState<[number, number]>(kochiPosition);
  const [coordinates, setCoordinates] = useState<string>("");

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      setCoordinates("Geolocation is not supported by this browser.");
    }
  }

  const success = (pos: GeolocationPosition) => {
    const { latitude, longitude } = pos.coords;
    setPosition([latitude, longitude]);
    setCoordinates(`Latitude: ${latitude}, Longitude: ${longitude}`);
  }

  const error = () => {
    setCoordinates("Sorry, no position available.");
  }

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <div>
      <MapContainer center={position} zoom={13} style={{ height: '450px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>
            You are here.
          </Popup>
        </Marker>
      </MapContainer>
      <h1>HTML Geolocation</h1>
      <p>Click the button to get your coordinates.</p>
      <button onClick={getLocation}>Try It</button>
      <div id="demo">{coordinates}</div>
    </div>
  );
};

export default Map;
