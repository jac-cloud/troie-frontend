import { fetchCurrentReadings, fetchHistoricalData, fetchSensors } from "./api"

export interface SensorConfig {
  deviceId: string,
  deviceName?: string
}

export interface SensorReadings {
  sensorId: string
  temperature: number
  humidity: number
  timestamp: string
  alert: boolean
}

// Get all available sensors
export const getSensors = async (): Promise<SensorConfig[]> => {
  return await fetchSensors()
}

// Get historical data for a specific date and sensor
export const getHistoricalDataForDate = async (date: Date, sensorId: string): Promise<SensorReadings[]> => {
  return await fetchHistoricalData(date, sensorId)
}

// Get current readings for a specific sensor
export const getCurrentReadings = async (sensorId: string): Promise<SensorReadings> => {
  return await fetchCurrentReadings(sensorId)
}
