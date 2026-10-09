import { useCarStore, CARS } from '../store/useCarStore'

export function CarSelector({ isOpen, onClose }) {
  const { selectedCar, setSelectedCar } = useCarStore()

  const handleSelect = (car) => {
    setSelectedCar(car)
    if (window.innerWidth <= 768) {
      onClose?.()
    }
  }

  return (
    <div className={`ui-panel car-selector ${isOpen ? 'open' : ''}`}>
      <button className="panel-close" onClick={onClose} aria-label="Close">
        ✕
      </button>
      <h2>Garage</h2>
      {CARS.map((car) => (
        <button
          key={car.id}
          className={`car-btn ${selectedCar.id === car.id ? 'active' : ''}`}
          onClick={() => handleSelect(car)}
        >
          {car.name}
        </button>
      ))}
    </div>
  )
}