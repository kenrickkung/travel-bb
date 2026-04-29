import { useState, useEffect } from 'react'
import { type City } from '../data/tripData'

export interface DayWeather {
  date: string
  tempMax: number
  tempMin: number
  wmoCode: number
  precip: number
}

const CITY_CONFIG: { id: City; lat: number; lon: number; tz: string }[] = [
  { id: 'London',    lat: 51.51, lon: -0.13, tz: 'Europe/London' },
  { id: 'Paris',     lat: 48.85, lon:  2.35, tz: 'Europe/Paris' },
  { id: 'Amsterdam', lat: 52.37, lon:  4.89, tz: 'Europe/Amsterdam' },
]

export function wmoEmoji(code: number): string {
  if (code === 0) return '☀️'
  if (code <= 2)  return '⛅'
  if (code === 3) return '☁️'
  if (code <= 49) return '🌫️'
  if (code <= 55) return '🌦️'
  if (code <= 57) return '🌨️'
  if (code <= 65) return '🌧️'
  if (code <= 67) return '🌨️'
  if (code <= 77) return '❄️'
  if (code <= 82) return '🌧️'
  if (code <= 86) return '🌨️'
  if (code <= 99) return '⛈️'
  return '🌡️'
}

async function fetchCityWeather(lat: number, lon: number, tz: string): Promise<DayWeather[]> {
  const url = new URL('https://archive-api.open-meteo.com/v1/archive')
  url.searchParams.set('latitude', String(lat))
  url.searchParams.set('longitude', String(lon))
  url.searchParams.set('start_date', '2025-06-21')
  url.searchParams.set('end_date', '2025-07-04')
  url.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum')
  url.searchParams.set('timezone', tz)
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error('weather fetch failed')
  const json = await res.json()
  const d = json.daily
  return (d.time as string[]).map((date: string, i: number) => ({
    date,
    tempMax: Math.round(d.temperature_2m_max[i]),
    tempMin: Math.round(d.temperature_2m_min[i]),
    wmoCode: d.weathercode[i] ?? 0,
    precip: Math.round((d.precipitation_sum[i] ?? 0) * 10) / 10,
  }))
}

type WeatherLookup = Partial<Record<City, DayWeather[]>>

export function useWeather() {
  const [lookup, setLookup] = useState<WeatherLookup>({})

  useEffect(() => {
    Promise.all(
      CITY_CONFIG.map(c =>
        fetchCityWeather(c.lat, c.lon, c.tz).then(data => ({ id: c.id, data }))
      )
    )
      .then(results => {
        const next: WeatherLookup = {}
        results.forEach(r => { next[r.id] = r.data })
        setLookup(next)
      })
      .catch(() => {/* silently fail — weather is decorative */})
  }, [])

  function getForDay(dayId: string, city: City): DayWeather | null {
    return lookup[city]?.find(d => d.date === dayId) ?? null
  }

  return { getForDay }
}
