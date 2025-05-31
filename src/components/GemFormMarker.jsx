import { useState } from 'react';
import { Marker, Popup } from 'react-leaflet';

export function GemFormMarker({ position, onSubmit }) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, description: desc, coords: [position.lat, position.lng] });
    setName('');
    setDesc('');
  };

  return (
    <Marker position={position}>
      <Popup>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Gem Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          /><br />
          <textarea
            placeholder="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            required
          /><br />
          <button type="submit">Add Gem</button>
        </form>
      </Popup>
    </Marker>
  );
}
