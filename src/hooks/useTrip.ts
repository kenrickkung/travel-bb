import { useState, useEffect, useCallback } from 'react'
import { type TripDay, type Activity, type City, SEED_DATA } from '../data/tripData'

const STORAGE_KEY = 'travel-bb-trip'

const MULTI_CITY_DAYS: Record<string, City[]> = {
  '2025-06-27': ['Paris', 'Amsterdam'],
}

function migrateDays(days: any[]): TripDay[] {
  return days.map(day => {
    const cities: City[] = day.cities ?? (day.city ? [day.city] : ['London'])
    const required = MULTI_CITY_DAYS[day.id]
    if (required) {
      const merged = [...new Set([...required, ...cities])] as City[]
      return { ...day, cities: merged }
    }
    return { ...day, cities }
  })
}

function loadDays(): TripDay[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const migrated = migrateDays(JSON.parse(saved))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated))
      return migrated
    }
  } catch {}
  return SEED_DATA
}

export function useTrip() {
  const [days, setDays] = useState<TripDay[]>(loadDays)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(days))
  }, [days])

  const updateActivity = useCallback((dayId: string, actId: string, fields: Partial<Activity>) => {
    setDays(prev =>
      prev.map(day =>
        day.id !== dayId
          ? day
          : { ...day, items: day.items.map(a => (a.id === actId ? { ...a, ...fields } : a)) }
      )
    )
  }, [])

  const deleteActivity = useCallback((dayId: string, actId: string) => {
    setDays(prev =>
      prev.map(day =>
        day.id !== dayId
          ? day
          : { ...day, items: day.items.filter(a => a.id !== actId) }
      )
    )
  }, [])

  const addActivity = useCallback((dayId: string) => {
    const newAct: Activity = { id: `${dayId}-${Date.now()}`, text: '' }
    setDays(prev =>
      prev.map(day =>
        day.id !== dayId ? day : { ...day, items: [...day.items, newAct] }
      )
    )
    return newAct.id
  }, [])

  const moveActivity = useCallback((dayId: string, fromIdx: number, toIdx: number) => {
    setDays(prev =>
      prev.map(day => {
        if (day.id !== dayId) return day
        const items = [...day.items]
        const [moved] = items.splice(fromIdx, 1)
        items.splice(toIdx, 0, moved)
        return { ...day, items }
      })
    )
  }, [])

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setDays(SEED_DATA)
  }, [])

  const replaceAll = useCallback((newDays: TripDay[]) => {
    setDays(newDays)
  }, [])

  return { days, updateActivity, deleteActivity, addActivity, moveActivity, reset, replaceAll }
}
