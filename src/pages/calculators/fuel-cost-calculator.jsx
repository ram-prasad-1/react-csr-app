import {useState, useEffect} from 'react'

// Constants
const VEHICLE_TYPES = {
  FUEL: 'fuel',
  EV: 'ev',
}

const DEFAULT_TRIP = {
  distance: 1,
  mileage: 16,
  fuelCost: 105,
  totalCost: 0,
  name: 'Trip 1',
  vehicleType: VEHICLE_TYPES.EV,
  electricityCost: 12, // Cost per kWh for EV
  chargingEfficiency: 0.85, // Charging efficiency for EV
  batterySize: 35, // Battery size in kWh
  range: 220, // Range in km
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

const EV_MILEAGE_LIMITS = {
  MIN: 1,
  MAX: 20, // km/kWh
  STEP: 0.1,
}

const RANGE_LIMITS = {
  MIN: 100,
  MAX: 800,
  STEP: 10,
}

const BATTERY_LIMITS = {
  MIN: 10,
  MAX: 150,
  STEP: 5,
}

const STORAGE_KEY = 'fuelCalculatorTrips'

// Utility functions
const formatNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

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
    const newTrip =
      trips.length === 0
        ? DEFAULT_TRIP
        : {
            distance: trips[trips.length - 1].distance,
            mileage: trips[trips.length - 1].mileage,
            fuelCost: trips[trips.length - 1].fuelCost,
            totalCost: 0,
            name: `Trip ${trips.length + 1}`,
            vehicleType: trips[trips.length - 1].vehicleType,
            electricityCost: trips[trips.length - 1].electricityCost,
            chargingEfficiency: trips[trips.length - 1].chargingEfficiency,
            batterySize: trips[trips.length - 1].batterySize,
            range: trips[trips.length - 1].range,
          }
    setTrips([...trips, newTrip])
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
  const [electricityCost, setElectricityCost] = useState(trip.electricityCost)
  const [name, setName] = useState(trip.name || `Trip ${index + 1}`)
  const [vehicleType, setVehicleType] = useState(trip.vehicleType)
  const [batterySize, setBatterySize] = useState(trip.batterySize)
  const [range, setRange] = useState(trip.range)
  const styles = getThemeStyles(isDarkMode)

  // Calculate derived values
  const calculatedEfficiency =
    vehicleType === VEHICLE_TYPES.EV
      ? batterySize > 0
        ? range / batterySize
        : 0
      : mileage

  const chargingEfficiency = trip.chargingEfficiency || 0.85
  const totalCost =
    vehicleType === VEHICLE_TYPES.EV
      ? calculatedEfficiency > 0 &&
        electricityCost > 0 &&
        chargingEfficiency > 0
        ? ((distance / calculatedEfficiency) * electricityCost) /
          chargingEfficiency
        : 0
      : mileage > 0 && fuelCost > 0
        ? (distance / mileage) * fuelCost
        : 0

  // Update parent whenever any value changes
  const updateParent = () => {
    onUpdate(index, {
      distance,
      mileage: calculatedEfficiency,
      fuelCost,
      electricityCost,
      totalCost,
      name,
      vehicleType,
      chargingEfficiency,
      batterySize,
      range,
    })
  }

  const handleDistanceChange = (e) => {
    const newValue = Number(e.target.value)
    const step = getDistanceStep(newValue)
    const roundedValue = Math.round(newValue / step) * step
    setDistance(roundedValue)
    updateParent()
  }

  const handleRangeChange = (e) => {
    const newValue = Number(e.target.value)
    const step = RANGE_LIMITS.STEP
    const roundedValue = Math.round(newValue / step) * step
    setRange(roundedValue)
    updateParent()
  }

  const handleVehicleTypeChange = (e) => {
    const newType = e.target.value
    setVehicleType(newType)
    // Reset values when switching vehicle types
    if (newType === VEHICLE_TYPES.EV) {
      setMileage(DEFAULT_TRIP.mileage)
      setBatterySize(DEFAULT_TRIP.batterySize)
      setRange(DEFAULT_TRIP.range)
      setElectricityCost(DEFAULT_TRIP.electricityCost)
    } else {
      setMileage(DEFAULT_TRIP.mileage)
      setFuelCost(DEFAULT_TRIP.fuelCost)
    }
    updateParent()
  }

  const handleCostChange = (e) => {
    const newValue = Number(e.target.value)
    if (vehicleType === VEHICLE_TYPES.EV) {
      setElectricityCost(newValue)
    } else {
      setFuelCost(newValue)
    }
    updateParent()
  }

  const handleMileageChange = (e) => {
    const newValue = Number(e.target.value)
    setMileage(newValue)
    updateParent()
  }

  const handleBatterySizeChange = (e) => {
    const newValue = Number(e.target.value)
    setBatterySize(newValue)
    updateParent()
  }

  const handleNameChange = (e) => {
    setName(e.target.value)
    updateParent()
  }

  return (
    <div className={`rounded-lg border p-4 ${styles.container}`}>
      <div className='mb-4 flex items-center justify-between'>
        <input
          type='text'
          value={name}
          onChange={handleNameChange}
          className={`border-b border-transparent bg-transparent text-lg font-bold outline-none hover:border-current focus:border-current ${
            isDarkMode ? 'text-white' : 'text-black'
          }`}
          placeholder={`Trip ${index + 1}`}
        />
        <select
          value={vehicleType}
          onChange={handleVehicleTypeChange}
          className={`ml-2 rounded p-1 text-sm ${styles.input}`}
        >
          <option value={VEHICLE_TYPES.FUEL}>Fuel Vehicle</option>
          <option value={VEHICLE_TYPES.EV}>Electric Vehicle</option>
        </select>
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

        {vehicleType === VEHICLE_TYPES.EV ? (
          <>
            {/* Range Input */}
            <div className='space-y-1'>
              <div className='flex items-center justify-between'>
                <label className='text-sm font-medium'>
                  Range Estimate (km)
                </label>
                <input
                  type='number'
                  min={RANGE_LIMITS.MIN}
                  max={RANGE_LIMITS.MAX}
                  step={RANGE_LIMITS.STEP}
                  value={range}
                  onChange={handleRangeChange}
                  className={`w-20 rounded p-1 text-center text-sm ${styles.input}`}
                />
              </div>
              <input
                type='range'
                min={RANGE_LIMITS.MIN}
                max={RANGE_LIMITS.MAX}
                step={RANGE_LIMITS.STEP}
                value={range}
                onChange={handleRangeChange}
                className={`h-1.5 w-full cursor-pointer appearance-none rounded-lg ${styles.slider}`}
              />
            </div>

            {/* Battery Size Input */}
            <div className='flex items-center gap-4'>
              <label className='text-sm font-medium'>Battery Size (kWh)</label>
              <input
                type='number'
                min={BATTERY_LIMITS.MIN}
                max={BATTERY_LIMITS.MAX}
                step={BATTERY_LIMITS.STEP}
                value={batterySize}
                onChange={handleBatterySizeChange}
                className={`w-24 rounded p-1 text-center text-sm ${styles.input}`}
              />
            </div>

            {/* Battery Efficiency Display */}
            <div className='flex items-center gap-8'>
              <span className='text-sm font-medium'>
                Battery Efficiency (km/kWh)
              </span>
              <span className='text-sm font-medium'>
                {calculatedEfficiency.toFixed(2)}
              </span>
            </div>
          </>
        ) : (
          /* Mileage Input for Fuel Vehicles */
          <div className='space-y-1'>
            <div className='flex items-center justify-between'>
              <label className='text-sm font-medium'>Mileage (km/l)</label>
              <input
                type='number'
                step={MILEAGE_LIMITS.STEP}
                value={mileage}
                onChange={handleMileageChange}
                className={`w-20 rounded p-1 text-center text-sm ${styles.input}`}
              />
            </div>
            <input
              type='range'
              min={MILEAGE_LIMITS.MIN}
              max={MILEAGE_LIMITS.MAX}
              step={MILEAGE_LIMITS.STEP}
              value={mileage}
              onChange={handleMileageChange}
              className={`h-1.5 w-full cursor-pointer appearance-none rounded-lg ${styles.slider}`}
            />
          </div>
        )}

        {/* Cost Input */}
        <div className='flex items-center gap-4'>
          <label className='text-sm font-medium'>
            {vehicleType === VEHICLE_TYPES.EV
              ? 'Electricity Cost (₹/kWh)'
              : 'Fuel Cost (₹/l)'}
          </label>
          <input
            type='number'
            value={
              vehicleType === VEHICLE_TYPES.EV ? electricityCost : fuelCost
            }
            onChange={handleCostChange}
            className={`w-24 rounded p-1 text-center text-sm ${styles.input}`}
          />
        </div>

        {/* Result */}
        <div className='border-t border-neutral-300 pt-2'>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium'>Total Cost</span>
            <span className='text-lg font-bold text-green-600'>
              ₹{formatNumber(totalCost.toFixed(2))}
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
                ₹{formatNumber(totalCost.toFixed(2))}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FuelCostCalculator
