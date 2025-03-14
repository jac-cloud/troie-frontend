"use client"

import { getCurrentReadings, getHistoricalDataForDate, getSensors } from "@/app/utils/data-utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { AlertTriangle, CalendarIcon, Droplets, Thermometer } from "lucide-react"
import { useEffect, useState } from "react"
import type { SensorConfig, WeatherDataPoint } from "./utils/data-utils"
import { WeatherChart } from "./weather-chart"

export default function WeatherDashboard() {
  const [sensors, setSensors] = useState<SensorConfig[]>([])
  const [currentTemp, setCurrentTemp] = useState<number | null>(null)
  const [currentHumidity, setCurrentHumidity] = useState<number | null>(null)
  const [alarm, setAlarm] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedSensor, setSelectedSensor] = useState<string>("")
  const [historicalData, setHistoricalData] = useState<WeatherDataPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load sensors on initial render
  useEffect(() => {
    const loadSensors = async () => {
      try {
        const sensorList = await getSensors()
        setSensors(sensorList)

        if (sensorList.length > 0 && !selectedSensor) {
          setSelectedSensor(sensorList[0].id)
        }

        setIsLoading(false)
      } catch (err) {
        console.error("Failed to load sensors:", err)
        setError("Failed to load sensors. Please check your connection and try again.")
        setIsLoading(false)
      }
    }

    loadSensors()
  }, [])

  // Load historical data when date or sensor changes
  useEffect(() => {
    if (!selectedSensor) return

    const loadHistoricalData = async () => {
      try {
        setIsLoading(true)
        const data = await getHistoricalDataForDate(selectedDate, selectedSensor)
        setHistoricalData(data)
        setIsLoading(false)
      } catch (err) {
        console.error("Failed to load historical data:", err)
        setError("Failed to load historical data. Please check your connection and try again.")
        setIsLoading(false)
      }
    }

    loadHistoricalData()
  }, [selectedDate, selectedSensor])

  // Update current readings when sensor changes and periodically
  useEffect(() => {
    if (!selectedSensor) return

    const updateCurrentReadings = async () => {
      try {
        const readings = await getCurrentReadings(selectedSensor)
        setCurrentTemp(readings.temperature)
        setCurrentHumidity(readings.humidity)

        setAlarm(readings.temperature > 20)
      } catch (err) {
        console.error("Failed to load current readings:", err)
        // Don't set error state here to avoid disrupting the UI for temporary failures
      }
    }

    // Initial load
    updateCurrentReadings()
  }, [selectedSensor])

  // Handle retry
  const handleRetry = () => {
    setError(null)
    setIsLoading(true)
    window.location.reload()
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8 flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <Button className="mt-4" onClick={handleRetry}>
            Retry
          </Button>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex items-center">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold mb-8">Weather Monitoring Dashboard</h1>

        {alarm && (
          <Alert variant="destructive" className="mb-6 bg-[antiquewhite] animate-pulse">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Environmental conditions have exceeded normal parameters. Please check the system.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center pb-2">
                <div>
                  <CardTitle>Historical Data</CardTitle>
                  <CardDescription>Temperature and humidity over 24 hours</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground",
                        )}
                        disabled={isLoading || sensors.length === 0}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  {isLoading && sensors.length === 0 ? (
                    <Skeleton className="h-10 w-[180px]" />
                  ) : (
                    <Select value={selectedSensor} onValueChange={setSelectedSensor} disabled={sensors.length === 0}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Select sensor" />
                      </SelectTrigger>
                      <SelectContent>
                        {sensors.map((sensor) => (
                          <SelectItem key={sensor.id} value={sensor.id}>
                            {sensor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </CardHeader>
              <CardContent className="h-[400px]">
                {isLoading ? (
                  <div className="h-full w-full flex items-center justify-center">
                    <div className="space-y-4 w-full">
                      <Skeleton className="h-[320px] w-full rounded-xl" />
                    </div>
                  </div>
                ) : (
                  <WeatherChart data={historicalData} />
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 flex flex-col">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Thermometer className="mr-2 h-5 w-5 text-red-500" />
                  Current Temperature
                </CardTitle>
                <CardDescription>{sensors.find((s) => s.id === selectedSensor)?.name || "Loading..."}</CardDescription>
              </CardHeader>
              <CardContent>
                {currentTemp === null ? (
                  <Skeleton className="h-10 w-20" />
                ) : (
                  <div className="text-4xl font-bold">{currentTemp}°C</div>
                )}
                <p className="text-sm text-muted-foreground mt-2">Updated just now</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Droplets className="mr-2 h-5 w-5 text-blue-500" />
                  Current Humidity
                </CardTitle>
                <CardDescription>{sensors.find((s) => s.id === selectedSensor)?.name || "Loading..."}</CardDescription>
              </CardHeader>
              <CardContent>
                {currentHumidity === null ? (
                  <Skeleton className="h-10 w-20" />
                ) : (
                  <div className="text-4xl font-bold">{currentHumidity}%</div>
                )}
                <p className="text-sm text-muted-foreground mt-2">Updated just now</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className={`h-3 w-3 rounded-full mr-2 ${alarm ? "bg-red-500" : "bg-green-500"}`}></div>
                  <span>{alarm ? "Alert Active" : "System Normal"}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
