import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon path issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});


const Map = () => {
  const kochiPosition: [number, number] = [10.0277, 76.3084];
  const [position, setPosition] = useState<[number, number]>(kochiPosition);
  const [speed, setSpeed] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [trackingStatus, setTrackingStatus] = useState<'idle' | 'tracking' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>("");

  const getLocation = () => {
    if (navigator.geolocation) {
      setTrackingStatus('tracking');
      navigator.geolocation.watchPosition(success, error, {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      });
    } else {
      setTrackingStatus('error');
      setErrorMessage("Geolocation is not supported by this browser.");
    }
  }

  const success = (pos: GeolocationPosition) => {
    const { latitude, longitude, speed, accuracy } = pos.coords;
    setPosition([latitude, longitude]);

    // Speed is in m/s, convert to km/h if it exists. Sometimes it's null.
    setSpeed(speed !== null ? (speed * 3.6) : 0);
    setAccuracy(accuracy);

    setTrackingStatus('tracking');
    setErrorMessage("");
  }

  const error = (err: GeolocationPositionError) => {
    setTrackingStatus('error');
    setErrorMessage("Failed to retrieve location.");
    console.error(err);
  }

  useEffect(() => {
    getLocation();
  }, []);

  // Display '---' if value is null or 0
  const displaySpeed = speed !== null && speed > 0.5 ? speed.toFixed(1) : '0.0';
  const displayAccuracy = accuracy !== null ? accuracy.toFixed(0) : '---';

  return (
    <>
      {/* Gamified Fitness HUD Panel Overlay */}
      <div className="fitness-hud">
        <div className="hud-header">
          <h1>Live Tracking</h1>
          <div className={`status-badge ${trackingStatus === 'error' ? 'error-badge' : ''}`}>
            <span className={`status-indicator ${trackingStatus === 'tracking' ? 'active' : trackingStatus === 'error' ? 'error' : ''}`}></span>
            {trackingStatus === 'tracking' ? 'Active' : trackingStatus === 'error' ? 'Offline' : 'Searching...'}
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-box">
            <span className="stat-label">Current Speed</span>
            <div className="stat-value">{displaySpeed}<span className="stat-unit">km/h</span></div>
          </div>
          <div className="stat-box">
            <span className="stat-label">GPS Accuracy</span>
            <div className="stat-value">{displayAccuracy}<span className="stat-unit">m</span></div>
          </div>
        </div>

        <div className="coords-display">
          {trackingStatus === 'tracking' && position
            ? `${position[0].toFixed(5)}° N, ${position[1].toFixed(5)}° E`
            : errorMessage || 'Waiting for signal...'}
        </div>
      </div>

      <div className="map-fullscreen">
        {/* We use the exact MapContainer setup that worked previously, returning to standard OpenStreetMap tiles */}
        <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position}>
            <Popup className="dark-popup">
              Active Location
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </>
  );
};

export default Map;
