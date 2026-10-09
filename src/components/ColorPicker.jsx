import { useCarStore } from '../store/useCarStore'

const BODY_COLORS = [
  '#c8102e', '#000000', '#ffffff', '#1e3a8a', '#065f46',
  '#facc15', '#ea580c', '#7c3aed', '#ec4899', '#6b7280',
  '#0ea5e9', '#84cc16',
]

const WHEEL_COLORS = [
  '#1a1a1a', '#000000', '#c0c0c0', '#d4af37', '#b87333',
  '#ffffff', '#4a4a4a', '#8b0000', '#1e3a8a', '#2d2d2d',
  '#e5e5e5', '#3f3f46',
]

const GLASS_COLORS = [
  '#1a1a1a', '#000000', '#2d3748', '#1e3a8a', '#065f46',
  '#7c2d12', '#4c1d95', '#831843', '#334155', '#0f172a',
  '#3b0764', '#1c1917',
]

function ColorGroup({ title, colors, value, onChange }) {
  return (
    <div className="color-group">
      <h3>{title}</h3>
      <div className="color-grid">
        {colors.map((c) => (
          <div
            key={c}
            className={`color-swatch ${value === c ? 'active' : ''}`}
            style={{ background: c }}
            onClick={() => onChange(c)}
          />
        ))}
      </div>
      <input
        type="color"
        className="custom-color-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

export function ColorPicker({ isOpen, onClose }) {
  const {
    bodyColor, setBodyColor,
    wheelColor, setWheelColor,
    glassColor, setGlassColor,
    glassOpacity, setGlassOpacity,
    clearcoatEnabled, setClearcoatEnabled,
  } = useCarStore()

  return (
    <div className={`ui-panel config-panel ${isOpen ? 'open' : ''}`}>
      <button className="panel-close" onClick={onClose} aria-label="Close">
        ✕
      </button>

      <h2>Configure</h2>

      <ColorGroup
        title="Body Color"
        colors={BODY_COLORS}
        value={bodyColor}
        onChange={setBodyColor}
      />

      <ColorGroup
        title="Wheel Color"
        colors={WHEEL_COLORS}
        value={wheelColor}
        onChange={setWheelColor}
      />

      <ColorGroup
        title="Glass Tint"
        colors={GLASS_COLORS}
        value={glassColor}
        onChange={setGlassColor}
      />

      <div className="color-group">
        <h3>Glass Opacity</h3>
        <input
          type="range"
          min="0.2"
          max="1"
          step="0.05"
          value={glassOpacity}
          onChange={(e) => setGlassOpacity(parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      <div className="color-group">
        <h3>Finish</h3>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 12,
            color: '#aaa',
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={clearcoatEnabled}
            onChange={(e) => setClearcoatEnabled(e.target.checked)}
          />
          Enable Gloss Finish
        </label>
      </div>
    </div>
  )
}