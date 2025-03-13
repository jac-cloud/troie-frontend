import sensorData from "../data/sensors.json"
import type { SensorConfig, WeatherDataPoint } from "./data-utils"

const API_URL = process.env.NEXT_PUBLIC_API_URL

// Helper function to format date for API requests
const formatDateForApi = (date: Date): string => {
  return date.toISOString().split("T")[0] // YYYY-MM-DD format
}

// Fetch all available sensors
export async function fetchSensors(): Promise<SensorConfig[]> {
  if (!API_URL) {
    console.warn("API_URL not set, using mock data")
    return sensorData.sensors
  }

  try {
    const response = await fetch(`${API_URL}/sensors`)

    if (!response.ok) {
      throw new Error(`Failed to fetch sensors: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching sensors:", error)
    // Fallback to mock data
    return sensorData.sensors
  }
}

// Fetch historical data for a specific date and sensor
export async function fetchHistoricalData(date: Date, sensorId: string): Promise<WeatherDataPoint[]> {
  if (!API_URL) {
    console.warn("API_URL not set, using mock data")
    return getMockHistoricalData(date, sensorId)
  }

  try {
    const formattedDate = formatDateForApi(date)
    const response = await fetch(`${API_URL}/historical-data?date=${formattedDate}&sensorId=${sensorId}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch historical data: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching historical data:", error)
    // Fallback to mock data
    return getMockHistoricalData(date, sensorId)
  }
}

// Fetch current readings for a specific sensor
export async function fetchCurrentReadings(sensorId: string): Promise<{ temperature: number; humidity: number }> {
  if (!API_URL) {
    console.warn("API_URL not set, using mock data")
    return getMockCurrentReadings(sensorId)
  }

  try {
    const response = await fetch(`${API_URL}/current-readings?sensorId=${sensorId}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch current readings: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching current readings:", error)
    // Fallback to mock data
    return getMockCurrentReadings(sensorId)
  }
}

// Mock data functions (used as fallback)
function getMockHistoricalData(date: Date, sensorId: string): WeatherDataPoint[] {
  // Use the date to seed a pseudo-random number generator
  const seed = date.getDate() + date.getMonth() * 31 + date.getFullYear() * 365

  // Get sensor configuration
  const sensor = sensorData.sensors.find((s) => s.id === sensorId) || sensorData.sensors[0]

  return Array.from({ length: 12 }, (_, i) => {
    const hour = i * 2
    const hourString = `${hour.toString().padStart(2, "0")}:00`

    // Generate somewhat random but consistent data for the same date and sensor
    const randomFactor = Math.sin(seed + i) * 3
    const temperature = Math.round((sensor.baseTemp + randomFactor * sensor.tempMultiplier + i * 0.3) * 10) / 10
    const humidity = Math.round(sensor.baseHumidity + randomFactor * sensor.humidityMultiplier * 2 - i * 0.2)

    return {
      time: hourString,
      temperature,
      humidity: Math.max(30, Math.min(70, humidity)),
    }
  })
}

function getMockCurrentReadings(sensorId: string): { temperature: number; humidity: number } {
  const sensor = sensorData.sensors.find((s) => s.id === sensorId) || sensorData.sensors[0]

  // Generate somewhat random current readings based on the sensor's base values
  const tempVariation = (Math.random() - 0.5) * 2
  const humidityVariation = (Math.random() - 0.5) * 5

  return {
    temperature: +(sensor.baseTemp + tempVariation).toFixed(1),
    humidity: Math.max(30, Math.min(70, Math.round(sensor.baseHumidity + humidityVariation))),
  }
}
