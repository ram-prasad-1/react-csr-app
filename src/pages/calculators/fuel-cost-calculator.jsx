import {useState, useEffect} from 'react'

// Constants
const DEFAULT_TRIP = {
  distance: 1,
  mileage: 16,
  fuelCost: 105,
  totalCost: 0,
  name: 'Trip 1',
}

const DISTANCE_LIMITS = {
  MIN: 1,
  MAX: 81000,
  STEPS: {
    SMALL: 1,
    MEDIUM: 5,
    LARGE: 10,
    XLARGE: 100,
    XXLARGE: 500,
    HUGE: 1000,
    MASSIVE: 2000,
    ENORMOUS: 5000,
  },
}

const MILEAGE_LIMITS = {
  MIN: 1,
  MAX: 50,
  STEP: 0.5,
}

const STORAGE_KEY = 'fuelCalculatorTrips'

// Utility functions
const getDistanceStep = (value) => {
  if (value < 10) return DISTANCE_LIMITS.STEPS.SMALL
  if (value < 100) return DISTANCE_LIMITS.STEPS.MEDIUM
  if (value < 1000) return DISTANCE_LIMITS.STEPS.LARGE
  if (value < 5000) return DISTANCE_LIMITS.STEPS.XLARGE
  if (value < 10000) return DISTANCE_LIMITS.STEPS.XXLARGE
  if (value < 50000) return DISTANCE_LIMITS.STEPS.HUGE
  if (value < 80000) return DISTANCE_LIMITS.STEPS.MASSIVE
  return DISTANCE_LIMITS.STEPS.ENORMOUS
}

const getThemeStyles = (isDarkMode) => ({
  container: isDarkMode
    ? 'bg-neutral-800 text-white border-neutral-700'
    : 'bg-neutral-100 text-black border-neutral-200',
  input: isDarkMode ? 'bg-neutral-700' : 'bg-white',
  slider: isDarkMode ? 'bg-neutral-600' : 'bg-gray-300',
  button: isDarkMode
    ? 'bg-neutral-700 hover:bg-neutral-600 text-white'
    : 'bg-white hover:bg-neutral-100 text-black',
  addButton: isDarkMode
    ? 'bg-green-600 hover:bg-green-500 text-white'
    : 'bg-green-500 hover:bg-green-400 text-white',
  removeButton: isDarkMode
    ? 'bg-neutral-700 hover:bg-neutral-600 text-white'
    : 'bg-neutral-200 hover:bg-neutral-300 text-black',
})

// Custom hook for managing trips
const useTrips = () => {
  const [trips, setTrips] = useState(() => {
    const savedTrips = localStorage.getItem(STORAGE_KEY)
    return savedTrips ? JSON.parse(savedTrips) : [DEFAULT_TRIP]
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips))
  }, [trips])

  const handleTripUpdate = (index, updatedTrip) => {
    const newTrips = [...trips]
    newTrips[index] = updatedTrip
    setTrips(newTrips)
  }

  const handleTripDelete = (index) => {
    const newTrips = trips.filter((_, i) => i !== index)
    setTrips(newTrips)
  }

  const addNewTrip = () => {
    setTrips([
      ...trips,
      {
        ...DEFAULT_TRIP,
        name: `Trip ${trips.length + 1}`,
      },
    ])
  }

  return {
    trips,
    handleTripUpdate,
    handleTripDelete,
    addNewTrip,
  }
}

const TripCard = ({trip, index, onUpdate, onDelete, isDarkMode}) => {
  const [distance, setDistance] = useState(trip.distance)
  const [mileage, setMileage] = useState(trip.mileage)
  const [fuelCost, setFuelCost] = useState(trip.fuelCost)
  const [name, setName] = useState(trip.name || `Trip ${index + 1}`)
  const [totalCost, setTotalCost] = useState(0)
  const styles = getThemeStyles(isDarkMode)

  useEffect(() => {
    const cost = (distance / mileage) * fuelCost
    setTotalCost(cost.toFixed(2))
    onUpdate(index, {distance, mileage, fuelCost, totalCost: cost, name})
  }, [distance, mileage, fuelCost, name])

  const handleDistanceChange = (e) => {
    const newValue = Number(e.target.value)
    const step = getDistanceStep(newValue)
    const roundedValue = Math.round(newValue / step) * step
    setDistance(roundedValue)
  }

  return (
    <div className={`rounded-lg border p-4 ${styles.container}`}>
      <div className='mb-4 flex items-center justify-between'>
        <input
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`border-b border-transparent bg-transparent text-lg font-bold outline-none hover:border-current focus:border-current ${
            isDarkMode ? 'text-white' : 'text-black'
          }`}
          placeholder={`Trip ${index + 1}`}
        />
      </div>

      <div className='space-y-4'>
        {/* Distance Input */}
        <div className='space-y-1'>
          <div className='flex items-center justify-between'>
            <label className='text-sm font-medium'>Distance (km)</label>
            <input
              type='number'
              min={DISTANCE_LIMITS.MIN}
              max={DISTANCE_LIMITS.MAX}
              step={getDistanceStep(distance)}
              value={distance}
              onChange={handleDistanceChange}
              className={`w-20 rounded p-1 text-center text-sm ${styles.input}`}
            />
          </div>
          <input
            type='range'
            min={DISTANCE_LIMITS.MIN}
            max={DISTANCE_LIMITS.MAX}
            step={getDistanceStep(distance)}
            value={distance}
            onChange={handleDistanceChange}
            className={`h-1.5 w-full cursor-pointer appearance-none rounded-lg ${styles.slider}`}
          />
        </div>

        {/* Mileage Input */}
        <div className='space-y-1'>
          <div className='flex items-center justify-between'>
            <label className='text-sm font-medium'>Mileage (km/l)</label>
            <input
              type='number'
              step={MILEAGE_LIMITS.STEP}
              value={mileage}
              onChange={(e) => setMileage(Number(e.target.value))}
              className={`w-20 rounded p-1 text-center text-sm ${styles.input}`}
            />
          </div>
          <input
            type='range'
            min={MILEAGE_LIMITS.MIN}
            max={MILEAGE_LIMITS.MAX}
            step={MILEAGE_LIMITS.STEP}
            value={mileage}
            onChange={(e) => setMileage(Number(e.target.value))}
            className={`h-1.5 w-full cursor-pointer appearance-none rounded-lg ${styles.slider}`}
          />
        </div>

        {/* Fuel Cost Input */}
        <div className='flex items-center gap-4'>
          <label className='text-sm font-medium'>Fuel Cost (₹/l)</label>
          <input
            type='number'
            value={fuelCost}
            onChange={(e) => setFuelCost(Number(e.target.value))}
            className={`w-24 rounded p-1 text-center text-sm ${styles.input}`}
          />
        </div>

        {/* Result */}
        <div className='border-t border-neutral-300 pt-2'>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium'>Total Cost</span>
            <span className='text-lg font-bold text-green-600'>
              ₹{totalCost}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

const FuelCostCalculator = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const {trips, handleTripUpdate, handleTripDelete, addNewTrip} = useTrips()
  const styles = getThemeStyles(isDarkMode)

  const totalCost = trips.reduce((sum, trip) => sum + trip.totalCost, 0)

  return (
    <div className={`rounded-lg p-4 ${styles.container}`}>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-xl font-bold'>Fuel Cost Calculator</h2>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`rounded-lg px-3 py-1 text-sm transition-colors ${styles.button}`}
        >
          {isDarkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>

      <div className='space-y-4'>
        {trips.map((trip, index) => (
          <TripCard
            key={index}
            trip={trip}
            index={index}
            onUpdate={handleTripUpdate}
            onDelete={handleTripDelete}
            isDarkMode={isDarkMode}
          />
        ))}

        <div className='flex gap-2'>
          <button
            onClick={addNewTrip}
            className={`flex w-fit items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors ${styles.addButton}`}
          >
            <span>+</span>
            <span>Add Trip</span>
          </button>

          <button
            onClick={() => handleTripDelete(trips.length - 1)}
            className={`flex w-fit items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors ${styles.removeButton}`}
          >
            <span>×</span>
            <span>Remove Last</span>
          </button>
        </div>

        {trips.length > 1 && (
          <div className={`rounded-lg border p-4 ${styles.container}`}>
            <h3 className='mb-2 text-lg font-bold'>Total Cost for All Trips</h3>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium'>Grand Total</span>
              <span className='text-xl font-bold text-green-600'>
                ₹{totalCost.toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FuelCostCalculator
