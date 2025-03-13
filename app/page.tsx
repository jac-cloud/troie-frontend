"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, Droplets, Thermometer } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { WeatherChart } from "./weather-chart"

// Mock data - in a real app, this would come from an API
const mockHistoricalData = [
  { time: "00:00", temperature: 21, humidity: 45 },
  { time: "02:00", temperature: 20, humidity: 48 },
  { time: "04:00", temperature: 19, humidity: 50 },
  { time: "06:00", temperature: 19, humidity: 52 },
  { time: "08:00", temperature: 20, humidity: 49 },
  { time: "10:00", temperature: 22, humidity: 45 },
  { time: "12:00", temperature: 24, humidity: 40 },
  { time: "14:00", temperature: 25, humidity: 38 },
  { time: "16:00", temperature: 24, humidity: 42 },
  { time: "18:00", temperature: 23, humidity: 45 },
  { time: "20:00", temperature: 22, humidity: 47 },
  { time: "22:00", temperature: 21, humidity: 46 },
]

export default function WeatherDashboard() {
  const [currentTemp, setCurrentTemp] = useState(23.5)
  const [currentHumidity, setCurrentHumidity] = useState(46)
  const [alarm, setAlarm] = useState(false)

  // Simulate changing values and occasional alarms
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTemp((prev) => +(prev + (Math.random() - 0.5)).toFixed(1))
      setCurrentHumidity((prev) => Math.max(30, Math.min(70, Math.round(prev + (Math.random() - 0.5) * 2))))

      // Randomly trigger alarm (10% chance)
      if (Math.random() < 0.1) {
        setAlarm(true)
        // Auto-clear alarm after 5 seconds
        setTimeout(() => setAlarm(false), 5000)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
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
              <CardHeader>
                <CardTitle>Historical Data</CardTitle>
                <CardDescription>Temperature and humidity over the last 24 hours</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <WeatherChart data={mockHistoricalData} />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Thermometer className="mr-2 h-5 w-5 text-red-500" />
                  Current Temperature
                </CardTitle>
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

