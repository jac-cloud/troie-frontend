import sensorData from "../data/sensors.json"

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

export const getSensors = (): SensorConfig[] => {
  return sensorData.sensors
}

export const getSensorById = (id: string): SensorConfig | undefined => {
  return sensorData.sensors.find((sensor) => sensor.id === id)
}

export const getHistoricalDataForDate = (date: Date, sensorId: string): WeatherDataPoint[] => {
  // Use the date to seed a pseudo-random number generator
  const seed = date.getDate() + date.getMonth() * 31 + date.getFullYear() * 365

  // Get sensor configuration
  const sensor = getSensorById(sensorId) || sensorData.sensors[0]

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

export const getCurrentReadings = (sensorId: string): { temperature: number; humidity: number } => {
  const sensor = getSensorById(sensorId) || sensorData.sensors[0]

  // Generate somewhat random current readings based on the sensor's base values
  const tempVariation = (Math.random() - 0.5) * 2
  const humidityVariation = (Math.random() - 0.5) * 5

  return {
    temperature: +(sensor.baseTemp + tempVariation).toFixed(1),
    humidity: Math.max(30, Math.min(70, Math.round(sensor.baseHumidity + humidityVariation))),
  }
}

