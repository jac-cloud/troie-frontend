import { fetchCurrentReadings, fetchHistoricalData, fetchSensors } from "./api"

export interface SensorConfig {
  id: string
  name: string
  baseTemp: number
  baseHumidity: number
  tempMultiplier: number
  humidityMultiplier: number
}

export interface WeatherDataPoint {
  time: string
  temperature: number
  humidity: number
}

// Get all available sensors
export const getSensors = async (): Promise<SensorConfig[]> => {
  return await fetchSensors()
}

// Get historical data for a specific date and sensor
export const getHistoricalDataForDate = async (date: Date, sensorId: string): Promise<WeatherDataPoint[]> => {
  return await fetchHistoricalData(date, sensorId)
}

// Get current readings for a specific sensor
export const getCurrentReadings = async (sensorId: string): Promise<{ temperature: number; humidity: number }> => {
  return await fetchCurrentReadings(sensorId)
}

