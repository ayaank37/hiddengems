import { useMapEvents } from 'react-leaflet';

export function AddGemOnClick({ onAdd }) {
  useMapEvents({
    click(e) {
      onAdd(e.latlng);
    },
  });
  return null;
}
