"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Sunrise,
  Sunset,
  Coffee,
  Bike,
  Moon,
  Sun,
  Umbrella,
  Camera,
  Mountain,
  BookOpen,
  Utensils,
  Music,
  Clock,
  Calendar,
  Cloud,
  CloudRain,
  CloudSun,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

// Mock data for sunrise/sunset times
const getSunData = (location: string) => {
  // In a real app, this would be an API call
  const locations: Record<
    string,
    {
      sunrise: string
      sunset: string
      dayLength: string
      lat: number
      lng: number
      weather: "clear" | "cloudy" | "rainy"
      temperature: number
      moonPhase: string
    }
  > = {
    "new york": {
      sunrise: "06:32 AM",
      sunset: "07:45 PM",
      dayLength: "13h 13m",
      lat: 40.7128,
      lng: -74.006,
      weather: "clear",
      temperature: 72,
      moonPhase: "Waxing Crescent",
    },
    london: {
      sunrise: "05:58 AM",
      sunset: "08:12 PM",
      dayLength: "14h 14m",
      lat: 51.5074,
      lng: -0.1278,
      weather: "cloudy",
      temperature: 65,
      moonPhase: "First Quarter",
    },
    tokyo: {
      sunrise: "05:12 AM",
      sunset: "06:32 PM",
      dayLength: "13h 20m",
      lat: 35.6762,
      lng: 139.6503,
      weather: "rainy",
      temperature: 78,
      moonPhase: "Full Moon",
    },
    sydney: {
      sunrise: "06:45 AM",
      sunset: "05:23 PM",
      dayLength: "10h 38m",
      lat: -33.8688,
      lng: 151.2093,
      weather: "clear",
      temperature: 68,
      moonPhase: "Waning Gibbous",
    },
    paris: {
      sunrise: "06:22 AM",
      sunset: "08:45 PM",
      dayLength: "14h 23m",
      lat: 48.8566,
      lng: 2.3522,
      weather: "cloudy",
      temperature: 70,
      moonPhase: "New Moon",
    },
  }

  const defaultData = {
    sunrise: "06:30 AM",
    sunset: "07:30 PM",
    dayLength: "13h 00m",
    lat: 0,
    lng: 0,
    weather: "clear" as const,
    temperature: 70,
    moonPhase: "Waxing Crescent",
  }

  return locations[location.toLowerCase()] || defaultData
}

// Activity suggestions based on time of day
const activities = {
  sunrise: [
    {
      icon: <Coffee className="h-4 w-4" />,
      name: "Morning coffee",
      description: "Start your day with a relaxing coffee",
      time: "30 min after sunrise",
    },
    {
      icon: <Bike className="h-4 w-4" />,
      name: "Morning jog",
      description: "Enjoy the fresh morning air",
      time: "1 hour after sunrise",
    },
    {
      icon: <Camera className="h-4 w-4" />,
      name: "Sunrise photography",
      description: "Capture the beautiful colors",
      time: "During sunrise",
    },
    {
      icon: <Mountain className="h-4 w-4" />,
      name: "Hiking",
      description: "Morning hike with the best views",
      time: "1-2 hours after sunrise",
    },
    {
      icon: <BookOpen className="h-4 w-4" />,
      name: "Morning reading",
      description: "Read with natural light",
      time: "2 hours after sunrise",
    },
  ],
  sunset: [
    {
      icon: <Camera className="h-4 w-4" />,
      name: "Sunset photography",
      description: "Capture the golden hour",
      time: "30 min before sunset",
    },
    {
      icon: <Umbrella className="h-4 w-4" />,
      name: "Beach walk",
      description: "Enjoy the cool evening breeze",
      time: "During sunset",
    },
    {
      icon: <Moon className="h-4 w-4" />,
      name: "Stargazing",
      description: "Wait for the stars to appear",
      time: "1 hour after sunset",
    },
    {
      icon: <Utensils className="h-4 w-4" />,
      name: "Dinner al fresco",
      description: "Dine with a sunset view",
      time: "During sunset",
    },
    {
      icon: <Music className="h-4 w-4" />,
      name: "Evening concert",
      description: "Enjoy music as day turns to night",
      time: "After sunset",
    },
  ],
}

// Weather icon mapping
const weatherIcons = {
  clear: <Sun className="h-5 w-5 text-amber-500" />,
  cloudy: <Cloud className="h-5 w-5 text-slate-500" />,
  rainy: <CloudRain className="h-5 w-5 text-blue-500" />,
}

export default function SunriseSunsetCard() {
  const [location, setLocation] = useState("")
  const [currentLocation, setCurrentLocation] = useState("New York")
  const [sunData, setSunData] = useState(getSunData("new york"))
  const [activeTab, setActiveTab] = useState("sunrise")
  const [dayProgress, setDayProgress] = useState(50)
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString())

  // Update current time and day progress
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString())

      // Calculate day progress (simplified)
      const hour = now.getHours()
      const minute = now.getMinutes()
      const totalMinutes = hour * 60 + minute
      const progress = Math.floor((totalMinutes / (24 * 60)) * 100)
      setDayProgress(progress)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const updateLocation = () => {
    if (location.trim()) {
      setSunData(getSunData(location))
      setCurrentLocation(location)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      updateLocation()
    }
  }

  // Determine if it's currently day or night (simplified)
  const getCurrentTimeOfDay = () => {
    const hour = new Date().getHours()
    return hour >= 6 && hour < 18 ? "day" : "night"
  }

  const timeOfDay = getCurrentTimeOfDay()

  // Get background gradient based on time of day and active tab
  const getBackgroundGradient = () => {
    if (activeTab === "sunrise") {
      return "bg-gradient-to-r from-amber-50 to-orange-100"
    } else {
      return "bg-gradient-to-r from-indigo-50 to-purple-100"
    }
  }

  return (
    <Card className="w-full max-w-6xl overflow-hidden">
      <div
        className={`h-2 ${activeTab === "sunrise" ? "bg-gradient-to-r from-amber-300 to-orange-500" : "bg-gradient-to-r from-indigo-800 to-purple-900"}`}
      />

      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left column - Main info */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Daily Sun Times</h2>
              <Badge variant="outline" className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {currentLocation}
              </Badge>
            </div>

            <div className="mb-6">
              <label htmlFor="location-input" className="block text-sm font-medium text-slate-700 mb-2">
                Set Location
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="location-input"
                    placeholder="Enter city name..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="pl-9"
                  />
                </div>
                <Button onClick={updateLocation}>
                  <MapPin className="h-4 w-4 mr-2" />
                  Set Location
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-1">Try: New York, London, Tokyo, Sydney, Paris</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div
                className={`p-4 rounded-lg ${activeTab === "sunrise" ? "bg-amber-50 border border-amber-200" : "bg-slate-50 border border-slate-200"}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Sunrise className="h-5 w-5 text-amber-500" />
                  <h3 className="font-semibold">Sunrise</h3>
                </div>
                <p className="text-3xl font-bold text-amber-700">{sunData.sunrise}</p>
                <div className="flex items-center gap-2 mt-2 text-sm text-amber-600">
                  <Clock className="h-4 w-4" />
                  <span>
                    First light:{" "}
                    {sunData.sunrise
                      .replace("AM", "AM")
                      .replace(/(\d+):(\d+)/, (_, h, m) => `${Number.parseInt(h) - 1}:${m}`)}
                  </span>
                </div>
              </div>

              <div
                className={`p-4 rounded-lg ${activeTab === "sunset" ? "bg-indigo-50 border border-indigo-200" : "bg-slate-50 border border-slate-200"}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Sunset className="h-5 w-5 text-indigo-600" />
                  <h3 className="font-semibold">Sunset</h3>
                </div>
                <p className="text-3xl font-bold text-indigo-700">{sunData.sunset}</p>
                <div className="flex items-center gap-2 mt-2 text-sm text-indigo-600">
                  <Clock className="h-4 w-4" />
                  <span>
                    Last light:{" "}
                    {sunData.sunset
                      .replace("PM", "PM")
                      .replace(/(\d+):(\d+)/, (_, h, m) => `${Number.parseInt(h) + 1}:${m}`)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
              <h3 className="font-semibold mb-3">Day Progress</h3>
              <div className="mb-2 flex justify-between text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <Sunrise className="h-4 w-4 text-amber-500" />
                  <span>{sunData.sunrise}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Sunset className="h-4 w-4 text-indigo-600" />
                  <span>{sunData.sunset}</span>
                </div>
              </div>
              <Progress value={dayProgress} className="h-3" />
              <div className="mt-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                    {timeOfDay === "day" ? (
                      <Sun className="h-5 w-5 text-amber-500" />
                    ) : (
                      <Moon className="h-5 w-5 text-indigo-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{timeOfDay === "day" ? "Daytime" : "Nighttime"}</p>
                    <p className="text-xs text-slate-500">{currentTime}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Day Length</p>
                  <p className="text-xs text-slate-500">{sunData.dayLength}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  {weatherIcons[sunData.weather]}
                  <h3 className="font-semibold">Weather</h3>
                </div>
                <p className="text-lg font-medium capitalize">{sunData.weather}</p>
                <p className="text-sm text-slate-500">{sunData.temperature}°F</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <Moon className="h-5 w-5 text-slate-700" />
                  <h3 className="font-semibold">Moon Phase</h3>
                </div>
                <p className="text-lg font-medium">{sunData.moonPhase}</p>
                <p className="text-sm text-slate-500">Visibility: Good</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5 text-slate-700" />
                  <h3 className="font-semibold">Date</h3>
                </div>
                <p className="text-lg font-medium">
                  {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                </p>
                <p className="text-sm text-slate-500">{new Date().getFullYear()}</p>
              </div>
            </div>
          </div>

          {/* Right column - Activities */}
          <div className="lg:w-1/3">
            <Tabs defaultValue="sunrise" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="sunrise" className="flex items-center gap-2">
                  <Sunrise className="h-4 w-4" />
                  <span>Sunrise Activities</span>
                </TabsTrigger>
                <TabsTrigger value="sunset" className="flex items-center gap-2">
                  <Sunset className="h-4 w-4" />
                  <span>Sunset Activities</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="sunrise" className="m-0">
                <div className={`p-4 rounded-lg ${getBackgroundGradient()} mb-4`}>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold">Morning Activities</h3>
                    <CloudSun className="h-5 w-5 text-amber-500" />
                  </div>
                  <p className="text-sm text-slate-600 mb-2">
                    Make the most of your morning with these activities timed around sunrise at {sunData.sunrise}.
                  </p>
                </div>

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {activities.sunrise.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-md bg-white border border-slate-200 hover:border-amber-300 transition-colors"
                    >
                      <div className="mt-0.5 bg-amber-100 h-10 w-10 rounded-full flex items-center justify-center text-amber-600">
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium text-sm">{activity.name}</p>
                          <Badge variant="outline" className="text-xs">
                            {activity.time}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{activity.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="sunset" className="m-0">
                <div className={`p-4 rounded-lg ${getBackgroundGradient()} mb-4`}>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold">Evening Activities</h3>
                    <Moon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <p className="text-sm text-slate-600 mb-2">
                    Wind down your day with these activities timed around sunset at {sunData.sunset}.
                  </p>
                </div>

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {activities.sunset.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-md bg-white border border-slate-200 hover:border-indigo-300 transition-colors"
                    >
                      <div className="mt-0.5 bg-indigo-100 h-10 w-10 rounded-full flex items-center justify-center text-indigo-600">
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium text-sm">{activity.name}</p>
                          <Badge variant="outline" className="text-xs">
                            {activity.time}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{activity.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Card>
  )
}

