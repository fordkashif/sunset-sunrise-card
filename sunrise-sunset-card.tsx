"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { MapPin, Sunrise, Sunset, Search, Coffee, Bike, Moon, Sun, Umbrella, Camera } from "lucide-react"

// Mock data for sunrise/sunset times
const getSunData = (location: string) => {
  // In a real app, this would be an API call
  const locations: Record<string, { sunrise: string; sunset: string; lat: number; lng: number }> = {
    "new york": { sunrise: "06:32 AM", sunset: "07:45 PM", lat: 40.7128, lng: -74.006 },
    london: { sunrise: "05:58 AM", sunset: "08:12 PM", lat: 51.5074, lng: -0.1278 },
    tokyo: { sunrise: "05:12 AM", sunset: "06:32 PM", lat: 35.6762, lng: 139.6503 },
    sydney: { sunrise: "06:45 AM", sunset: "05:23 PM", lat: -33.8688, lng: 151.2093 },
    paris: { sunrise: "06:22 AM", sunset: "08:45 PM", lat: 48.8566, lng: 2.3522 },
  }

  const defaultData = { sunrise: "06:30 AM", sunset: "07:30 PM", lat: 0, lng: 0 }
  return locations[location.toLowerCase()] || defaultData
}

// Activity suggestions based on time of day
const activities = {
  sunrise: [
    {
      icon: <Coffee className="h-4 w-4" />,
      name: "Morning coffee",
      description: "Start your day with a relaxing coffee",
    },
    { icon: <Bike className="h-4 w-4" />, name: "Morning jog", description: "Enjoy the fresh morning air" },
    { icon: <Camera className="h-4 w-4" />, name: "Sunrise photography", description: "Capture the beautiful colors" },
  ],
  sunset: [
    { icon: <Camera className="h-4 w-4" />, name: "Sunset photography", description: "Capture the golden hour" },
    { icon: <Umbrella className="h-4 w-4" />, name: "Beach walk", description: "Enjoy the cool evening breeze" },
    { icon: <Moon className="h-4 w-4" />, name: "Stargazing", description: "Wait for the stars to appear" },
  ],
}

export default function SunriseSunsetCard() {
  const [location, setLocation] = useState("")
  const [currentLocation, setCurrentLocation] = useState("New York")
  const [sunData, setSunData] = useState(getSunData("new york"))
  const [activeTab, setActiveTab] = useState("sunrise")

  const handleSearch = () => {
    if (location.trim()) {
      setSunData(getSunData(location))
      setCurrentLocation(location)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  // Determine if it's currently day or night (simplified)
  const getCurrentTimeOfDay = () => {
    const hour = new Date().getHours()
    return hour >= 6 && hour < 18 ? "day" : "night"
  }

  const timeOfDay = getCurrentTimeOfDay()

  return (
    <Card className="w-full max-w-md overflow-hidden">
      <div
        className={`h-3 ${activeTab === "sunrise" ? "bg-gradient-to-r from-amber-300 to-orange-500" : "bg-gradient-to-r from-indigo-800 to-purple-900"}`}
      />

      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">Daily Sun Times</CardTitle>
          <Badge variant="outline" className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {currentLocation}
          </Badge>
        </div>
        <CardDescription>Get sunrise and sunset times for your location</CardDescription>
      </CardHeader>

      <CardContent className="pb-0">
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Enter location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button size="icon" onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="sunrise" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sunrise" className="flex items-center gap-2">
              <Sunrise className="h-4 w-4" />
              <span>Sunrise</span>
            </TabsTrigger>
            <TabsTrigger value="sunset" className="flex items-center gap-2">
              <Sunset className="h-4 w-4" />
              <span>Sunset</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sunrise" className="mt-4">
            <div className="flex items-center justify-center py-6 bg-gradient-to-b from-amber-50 to-orange-100 rounded-md">
              <div className="flex flex-col items-center">
                <Sunrise className="h-12 w-12 text-amber-500 mb-2" />
                <span className="text-2xl font-bold text-amber-700">{sunData.sunrise}</span>
                <span className="text-sm text-amber-600">Rise and shine!</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sunset" className="mt-4">
            <div className="flex items-center justify-center py-6 bg-gradient-to-b from-indigo-50 to-purple-100 rounded-md">
              <div className="flex flex-col items-center">
                <Sunset className="h-12 w-12 text-indigo-600 mb-2" />
                <span className="text-2xl font-bold text-indigo-700">{sunData.sunset}</span>
                <span className="text-sm text-indigo-600">Time to wind down</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="my-4" />

        <div>
          <h3 className="text-sm font-medium mb-2">Suggested Activities</h3>
          <div className="space-y-2">
            {activities[activeTab as "sunrise" | "sunset"].map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-2 rounded-md hover:bg-accent transition-colors">
                <div className="mt-0.5 bg-muted h-8 w-8 rounded-full flex items-center justify-center">
                  {activity.icon}
                </div>
                <div>
                  <p className="font-medium text-sm">{activity.name}</p>
                  <p className="text-xs text-muted-foreground">{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4 pb-4">
        <div className="w-full flex justify-between items-center text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            {timeOfDay === "day" ? (
              <>
                <Sun className="h-3 w-3" />
                <span>Currently daytime</span>
              </>
            ) : (
              <>
                <Moon className="h-3 w-3" />
                <span>Currently nighttime</span>
              </>
            )}
          </div>
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </CardFooter>
    </Card>
  )
}

