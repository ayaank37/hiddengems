import { MapContainer, TileLayer } from 'react-leaflet';

export default function MapView({ children }) {
  return (
    <MapContainer
      center={[40.4175, -74.7064]} // Montgomery
      zoom={13}
      style={{ height: '100vh', width: '100vw' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {children}
    </MapContainer>
  );
}
