import { useState } from 'react'
import { Scene } from './components/Scene'
import { CarSelector } from './components/CarSelector'
import { ColorPicker } from './components/ColorPicker'

export default function App() {
  const [error, setError] = useState(null)
  const [garageOpen, setGarageOpen] = useState(false)
  const [configOpen, setConfigOpen] = useState(false)

  const anyOpen = garageOpen || configOpen

  const closeAll = () => {
    setGarageOpen(false)
    setConfigOpen(false)
  }

  const openGarage = () => {
    setConfigOpen(false)
    setGarageOpen(true)
  }

  const openConfig = () => {
    setGarageOpen(false)
    setConfigOpen(true)
  }

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden', 
      }}
    >
      <div className="brand-logo">Configurator</div>

      <Scene onError={setError} />

      <button
        className="mobile-toggle garage-toggle"
        onClick={openGarage}
        aria-label="Open garage"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <path d="M9 22V12h6v10" />
        </svg>
      </button>

      <button
        className="mobile-toggle config-toggle"
        onClick={openConfig}
        aria-label="Open configuration"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 008 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 8a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
      </button>

      <div
        className={`mobile-overlay ${anyOpen ? 'open' : ''}`}
        onClick={closeAll}
      />

      <CarSelector isOpen={garageOpen} onClose={closeAll} />
      <ColorPicker isOpen={configOpen} onClose={closeAll} />

      {error && <div className="error-box">⚠ {error}</div>}
    </div>
  )
}