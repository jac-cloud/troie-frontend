import type { SensorConfig, WeatherDataPoint } from "./data-utils"

// API URLs from environment variables
const SENSORS_URL = process.env.NEXT_PUBLIC_SENSORS_URL || "/sensors.json"
const HISTORICAL_DATA_URL = process.env.NEXT_PUBLIC_HISTORICAL_DATA_URL || "/historical-data.json"
const CURRENT_READINGS_URL = process.env.NEXT_PUBLIC_CURRENT_READINGS_URL || "/current-readings.json"

// Helper function to format date for filtering
const formatDateForFilter = (date: Date): string => {
  return date.toISOString().split("T")[0] // YYYY-MM-DD format
}

// Fetch all available sensors
export async function fetchSensors(): Promise<SensorConfig[]> {
  try {
    const response = await fetch(SENSORS_URL)

    if (!response.ok) {
      throw new Error(`Failed to fetch sensors: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching sensors:", error)
    throw error // Re-throw to let the component handle the error
  }
}

// Fetch historical data for a specific date and sensor
export async function fetchHistoricalData(date: Date, sensorId: string): Promise<WeatherDataPoint[]> {
  try {
    const formattedDate = formatDateForFilter(date)
    const response = await fetch(`${HISTORICAL_DATA_URL}?date=${formattedDate}&sensorId=${sensorId}`)

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
export async function fetchCurrentReadings(sensorId: string): Promise<{ temperature: number; humidity: number }> {
  try {
    const response = await fetch(`${CURRENT_READINGS_URL}?sensorId=${sensorId}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch current readings: ${response.status}`)
    }

    const data = await response.json()
    return {
      temperature: data.temperature,
      humidity: data.humidity,
    }
  } catch (error) {
    console.error("Error fetching current readings:", error)
    return { temperature: 0, humidity: 0 }
  }
}
