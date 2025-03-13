"use client"

import { getCurrentReadings, getHistoricalDataForDate, getSensors } from "@/app/utils/data-utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { AlertTriangle, CalendarIcon, Droplets, Thermometer } from "lucide-react"
import { useEffect, useState } from "react"
import { WeatherChart } from "./weather-chart"

export default function WeatherDashboard() {
  const sensors = getSensors()
  const [currentTemp, setCurrentTemp] = useState(23.5)
  const [currentHumidity, setCurrentHumidity] = useState(46)
  const [alarm, setAlarm] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedSensor, setSelectedSensor] = useState(sensors[0].id)

  // Update current readings when sensor changes
  useEffect(() => {
    const readings = getCurrentReadings(selectedSensor)
    setCurrentTemp(readings.temperature)
    setCurrentHumidity(readings.humidity)
  }, [selectedSensor])

  // Simulate changing values and occasional alarms
  useEffect(() => {
    const interval = setInterval(() => {
      const readings = getCurrentReadings(selectedSensor)
      setCurrentTemp((prev) => +(prev + (readings.temperature - prev) * 0.2).toFixed(1))
      setCurrentHumidity((prev) => Math.round(prev + (readings.humidity - prev) * 0.2))

      // Randomly trigger alarm (10% chance)
      if (Math.random() < 0.1) {
        setAlarm(true)
        // Auto-clear alarm after 5 seconds
        setTimeout(() => setAlarm(false), 5000)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [selectedSensor])

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex items-center">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold mb-8">Weather Monitoring Dashboard</h1>

        {alarm && (
          <Alert variant="destructive" className="mb-6 animate-pulse">
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
                  <Select value={selectedSensor} onValueChange={setSelectedSensor}>
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
                </div>
              </CardHeader>
              <CardContent className="h-[400px] flex justify-center">
                <WeatherChart data={getHistoricalDataForDate(selectedDate, selectedSensor)} />
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
                <CardDescription>{sensors.find((s) => s.id === selectedSensor)?.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{currentTemp}°C</div>
                <p className="text-sm text-muted-foreground mt-2">Updated just now</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Droplets className="mr-2 h-5 w-5 text-blue-500" />
                  Current Humidity
                </CardTitle>
                <CardDescription>{sensors.find((s) => s.id === selectedSensor)?.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{currentHumidity}%</div>
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
