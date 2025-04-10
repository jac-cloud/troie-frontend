import type { SensorConfig, SensorReadings } from "./data-utils"

// API URLs from environment variables
const SENSORS_URL = process.env.NEXT_PUBLIC_SENSORS_URL
const HISTORICAL_DATA_URL = process.env.NEXT_PUBLIC_HISTORICAL_DATA_URL
const CURRENT_READINGS_URL = process.env.NEXT_PUBLIC_CURRENT_READINGS_URL

if (!SENSORS_URL || !HISTORICAL_DATA_URL || !CURRENT_READINGS_URL) {
  throw new Error("API URLs are not defined in environment variables.")
}

// Helper function to format date for filtering
const formatDateForFilter = (date: Date): string => {
  date.setHours(12, 0, 0, 0) // Set time to midnight to match the historical data format
  console.log("Formatting date for filter:", date.toISOString())
  
  const adjustedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return adjustedDate.toISOString().split("T")[0] // YYYY-MM-DD format
}

// Fetch all available sensors
export async function fetchSensors(): Promise<SensorConfig[]> {
  try {
    if (!SENSORS_URL) {
      throw new Error("SENSORS_URL is not defined in environment variables.")
    }
    
    const response = await fetch(SENSORS_URL)

    if (!response.ok) {
      throw new Error(`Failed to fetch sensors: ${response.status}`)
    }

    const data = await response.json()
    return data.map((sensor: SensorConfig) => ({
      deviceId: sensor.deviceId,
      deviceName: sensor.deviceName || sensor.deviceId,
    }))
  } catch (error) {
    console.error("Error fetching sensors:", error)
    throw error // Re-throw to let the component handle the error
  }
}

// Fetch historical data for a specific date and sensor
export async function fetchHistoricalData(date: Date, sensorId: string): Promise<SensorReadings[]> {
  try {
    const formattedDate = formatDateForFilter(date)
    const response = await fetch(`${HISTORICAL_DATA_URL}/${sensorId}?startDate=${formattedDate}&endDate=${formattedDate}&points=24`)

    if (!response.ok) {
      throw new Error(`Failed to fetch historical data: ${response.status}`)  
    }

    const data = await response.json()

    return data
  } catch (error) {
    console.error("Error fetching historical data:", error)
    return []
  }
}

// Fetch current readings for a specific sensor
export async function fetchCurrentReadings(sensorId: string): Promise<SensorReadings> {
  try {
    // get today's date
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Set time to midnight to match the historical data format

    const response = await fetchHistoricalData(today, sensorId)
    console.log("Current readings response:", response)
    
    if (response.length === 0) {
      throw new Error("No data available for the current date.")
    }
    const latestReading = response[response.length - 1]

    return latestReading
  } catch (error) {
    console.error("Error fetching current readings:", error)
    return {
      temperature: 0,
      humidity: 0,
      timestamp: "",
      alert: false,
      sensorId: sensorId,
    }
  }
}
