'use client'

import { useState } from 'react'
import { Card, CardContent } from "../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Button } from "../components/ui/button"
import dynamic from 'next/dynamic'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Moon, Sun } from 'lucide-react'

// Import player data and types
import { playerData, provinceCoordinates } from './data'
import type { Player } from './types'

// Dynamic import of PlayerGrid to avoid SSR issues
const PlayerGrid = dynamic(() => import('./components/player-grid'), { ssr: false })

export default function TalentMapper() {
  const [selectedProvince, setSelectedProvince] = useState<string>("all")
  const [selectedCity, setSelectedCity] = useState<string>("all")
  const [selectedClub, setSelectedClub] = useState<string>("all")
  const [insights, setInsights] = useState<string>("")
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Get unique values for filters
  const provinces = [...new Set(playerData.map(player => player.province))]
  const cities = [...new Set(playerData.map(player => player.city))]
  const clubs = [...new Set(playerData.map(player => player.club))]

  // Filter players based on selections
  const filteredPlayers = playerData.filter(player => {
    return (
      (selectedProvince === "all" || player.province === selectedProvince) &&
      (selectedCity === "all" || player.city === selectedCity) &&
      (selectedClub === "all" || player.club === selectedClub)
    )
  })

  // Generate insights
  const generateInsights = () => {
    const clubCounts = filteredPlayers.reduce((acc, player) => {
      acc[player.club] = (acc[player.club] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topClub = Object.entries(clubCounts).sort((a, b) => b[1] - a[1])[0]
    
    setInsights(
      `This region has ${filteredPlayers.length} players, with ${topClub[0]} having the most representatives (${topClub[1]} players).`
    )
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">South African Football Talent Mapper</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Select value={selectedProvince} onValueChange={setSelectedProvince}>
              <SelectTrigger>
                <SelectValue placeholder="Select province" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All provinces</SelectItem>
                {provinces.map(province => (
                  <SelectItem key={province} value={province}>
                    {province}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger>
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All cities</SelectItem>
                {cities.map(city => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedClub} onValueChange={setSelectedClub}>
              <SelectTrigger>
                <SelectValue placeholder="Select club" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All clubs</SelectItem>
                {clubs.map(club => (
                  <SelectItem key={club} value={club}>
                    {club}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-0">
                  <div className="h-[500px] rounded-lg overflow-hidden relative z-0">
                    <MapContainer
                      center={[-29.0852, 26.1596]}
                      zoom={6}
                      className="h-full w-full"
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      {filteredPlayers.map((player, index) => {
                        const coords = provinceCoordinates[player.province]
                        if (coords) {
                          return (
                            <Marker key={index} position={coords}>
                              <Popup>
                                <div className="text-sm">
                                  <p className="font-bold">{player.name}</p>
                                  <p>{player.position}</p>
                                  <p>{player.club}</p>
                                </div>
                              </Popup>
                            </Marker>
                          )
                        }
                        return null
                      })}
                    </MapContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Insights */}
            <div className="lg:col-span-1">
              <Card className="mb-6">
                <CardContent className="p-6">
                  <Button 
                    className="w-full mb-4" 
                    onClick={generateInsights}
                  >
                    Generate Insights
                  </Button>
                  {insights && (
                    <p className="text-sm">{insights}</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Player Grid */}
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">
              Players ({filteredPlayers.length})
            </h2>
            <PlayerGrid players={filteredPlayers} />
          </div>
        </div>
      </div>
    </div>
  )
}
