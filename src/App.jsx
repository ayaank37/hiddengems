import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadowUrl from "leaflet/dist/images/marker-shadow.png";

// Constants
const TAGS = ["Breakfast", "Lunch", "Dinner", "Cafe"];
const PRICES = ["$", "$$", "$$$"];

// Default Leaflet Icon
let DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadowUrl,
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// UI Styles
const styles = {
  button: {
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    marginLeft: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },
  input: {
    width: "100%",
    padding: "8px",
    margin: "6px 0",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  card: {
    padding: "1rem",
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    minWidth: "250px",
    maxWidth: "100%",
  },
};

// Component: Add New Gem Form
function GemFormMarker({ position, onAddGem, onCancel }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState([]);
  const [price, setPrice] = useState("");

  const toggleTag = (tag) =>
    setTags(tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Please enter a name for the hidden gem.");
    onAddGem({ position, name, description: desc, tags, price });
  };

  return (
    <Popup position={position} onClose={onCancel} autoClose={false}>
      <div style={styles.card}>
        <h3>Add Hidden Gem</h3>
        <form onSubmit={handleSubmit}>
          <label>Name:
            <input style={styles.input} value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>Description:
            <textarea style={styles.input} rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} />
          </label>
          <label>Tags:</label>
          <div>
            {TAGS.map((tag) => (
              <label key={tag} style={{ marginRight: "10px" }}>
                <input type="checkbox" checked={tags.includes(tag)} onChange={() => toggleTag(tag)} />
                {tag}
              </label>
            ))}
          </div>
          <label>Price:
            <select style={styles.input} value={price} onChange={(e) => setPrice(e.target.value)}>
              <option value="">Select</option>
              {PRICES.map((p) => <option key={p}>{p}</option>)}
            </select>
          </label>
          <div style={{ marginTop: "10px", display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" style={styles.button}>Add</button>
            <button type="button" onClick={onCancel} style={styles.cancelButton}>Cancel</button>
          </div>
        </form>
      </div>
    </Popup>
  );
}

// Component: Edit Form for Existing Gem
function EditGemForm({ gem, onSave, onCancel }) {
  const [name, setName] = useState(gem.name);
  const [desc, setDesc] = useState(gem.description);
  const [tags, setTags] = useState(gem.tags || []);
  const [price, setPrice] = useState(gem.price || "");

  const toggleTag = (tag) =>
    setTags(tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Name cannot be empty.");
    onSave({ ...gem, name, description: desc, tags, price });
  };

  return (
    <form onSubmit={handleSubmit} style={styles.card}>
      <label>Name:
        <input style={styles.input} value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label>Description:
        <textarea style={styles.input} rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} />
      </label>
      <label>Tags:</label>
      <div>
        {TAGS.map((tag) => (
          <label key={tag} style={{ marginRight: "10px" }}>
            <input type="checkbox" checked={tags.includes(tag)} onChange={() => toggleTag(tag)} />
            {tag}
          </label>
        ))}
      </div>
      <label>Price:
        <select style={styles.input} value={price} onChange={(e) => setPrice(e.target.value)}>
          <option value="">Select</option>
          {PRICES.map((p) => <option key={p}>{p}</option>)}
        </select>
      </label>
      <div style={{ marginTop: "10px", display: "flex", justifyContent: "flex-end" }}>
        <button type="submit" style={styles.button}>Save</button>
        <button type="button" onClick={onCancel} style={styles.cancelButton}>Cancel</button>
      </div>
    </form>
  );
}

// Component: Tag & Price Filters
function TagFilter({ selectedTags, setSelectedTags, selectedPrice, setSelectedPrice }) {
  const toggleTag = (tag) =>
    setSelectedTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);

  return (
    <div style={{ padding: "1rem", background: "#fff", marginBottom: "1rem", borderRadius: "8px", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
      <h4>Filter by Tag & Price</h4>
      <div>
        {TAGS.map((tag) => (
          <label key={tag} style={{ marginRight: "10px" }}>
            <input type="checkbox" checked={selectedTags.includes(tag)} onChange={() => toggleTag(tag)} />
            {tag}
          </label>
        ))}
      </div>
      <select style={{ ...styles.input, marginTop: "10px" }} value={selectedPrice} onChange={(e) => setSelectedPrice(e.target.value)}>
        <option value="">All Prices</option>
        {PRICES.map((p) => <option key={p}>{p}</option>)}
      </select>
    </div>
  );
}

// Component: Click Handler
function AddMarkerOnClick({ settingFilterCenter, setFilterCenter, setSettingFilterCenter, setAddingPosition }) {
  useMapEvents({
    click(e) {
      if (settingFilterCenter) {
        setFilterCenter(e.latlng);
        setSettingFilterCenter(false);
        alert(`Filter center set at: ${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`);
      } else {
        setAddingPosition(e.latlng);
      }
    },
  });
  return null;
}

// Main App Component
export default function App() {
  const [gems, setGems] = useState([]);
  const [addingPosition, setAddingPosition] = useState(null);
  const [editingGemIndex, setEditingGemIndex] = useState(null);
  const [filterCenter, setFilterCenter] = useState(null);
  const [radiusMiles, setRadiusMiles] = useState("");
  const [settingFilterCenter, setSettingFilterCenter] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState("");

  const milesToMeters = (miles) => miles * 1609.34;
  const distanceBetween = (pos1, pos2) => {
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371000;
    const dLat = toRad(pos2.lat - pos1.lat);
    const dLng = toRad(pos2.lng - pos1.lng);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(pos1.lat)) * Math.cos(toRad(pos2.lat)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const filteredGems = gems.filter((gem) => {
    const withinDistance = !filterCenter || !radiusMiles || distanceBetween(filterCenter, gem.position) <= milesToMeters(radiusMiles);
    const tagMatch = selectedTags.length === 0 || gem.tags?.some((t) => selectedTags.includes(t));
    const priceMatch = !selectedPrice || gem.price === selectedPrice;
    return withinDistance && tagMatch && priceMatch;
  });

  const addGem = (gem) => {
    setGems([...gems, gem]);
    setAddingPosition(null);
  };

  const saveGem = (updatedGem) => {
    const newGems = [...gems];
    newGems[editingGemIndex] = updatedGem;
    setGems(newGems);
    setEditingGemIndex(null);
  };

  const deleteGem = (index) => {
    if (window.confirm("Delete this hidden gem?")) {
      setGems(gems.filter((_, i) => i !== index));
    }
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "1000px", margin: "auto", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", fontSize: "1.8rem", marginBottom: "1rem" }}>Hidden Gem Explorer</h1>

      <TagFilter selectedTags={selectedTags} setSelectedTags={setSelectedTags} selectedPrice={selectedPrice} setSelectedPrice={setSelectedPrice} />

      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
        <button onClick={() => { setSettingFilterCenter(true); alert("Click on the map to set filter center."); }} style={styles.button}>Set Filter Center</button>
        <input type="number" placeholder="Radius (miles)" value={radiusMiles} onChange={(e) => setRadiusMiles(e.target.value)} style={{ ...styles.input, flex: "1", maxWidth: "200px" }} />
      </div>

      <MapContainer center={[40.73061, -73.935242]} zoom={13} style={{ height: "70vh", width: "100%", borderRadius: "10px" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />

        {filteredGems.map((gem, idx) => (
          <Marker key={idx} position={gem.position}>
            <Popup>
              {editingGemIndex === idx ? (
                <EditGemForm gem={gem} onSave={saveGem} onCancel={() => setEditingGemIndex(null)} />
              ) : (
                <div>
                  <strong>{gem.name}</strong><br />
                  {gem.description}<br />
                  <em>{gem.tags?.join(", ")}</em><br />
                  {gem.price && <span>Price: {gem.price}</span>}<br />
                  <button onClick={() => setEditingGemIndex(idx)} style={styles.button}>Edit</button>
                  <button onClick={() => deleteGem(idx)} style={styles.cancelButton}>Delete</button>
                </div>
              )}
            </Popup>
          </Marker>
        ))}

        {addingPosition && <GemFormMarker position={addingPosition} onAddGem={addGem} onCancel={() => setAddingPosition(null)} />}

        <AddMarkerOnClick
          settingFilterCenter={settingFilterCenter}
          setFilterCenter={setFilterCenter}
          setSettingFilterCenter={setSettingFilterCenter}
          setAddingPosition={setAddingPosition}
        />

        {filterCenter && radiusMiles && (
          <Circle
            center={filterCenter}
            radius={milesToMeters(radiusMiles)}
            pathOptions={{ color: "blue", fillOpacity: 0.1 }}
          />
        )}
      </MapContainer>

      <p style={{ textAlign: "center", fontStyle: "italic", marginTop: "1rem" }}>
        Tap anywhere on the map to add a new hidden gem.
      </p>
    </div>
  );
}