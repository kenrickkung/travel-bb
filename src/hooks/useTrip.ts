import { useState, useEffect, useCallback, useRef } from 'react'
import { type TripDay, type Activity, type City, SEED_DATA } from '../data/tripData'
import {
  fetchDays, fetchNotes,
  upsertActivity, deleteActivityDb, reorderActivities,
  upsertNote, seedDays, resetToSeed,
} from '../lib/db'

const STORAGE_KEY = 'travel-bb-trip'
const NOTES_KEY = 'travel-bb-notes'

const MULTI_CITY_DAYS: Record<string, City[]> = {
  '2025-06-27': ['Paris', 'Amsterdam'],
}

export type SyncStatus = 'idle' | 'syncing' | 'error'

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

function loadDaysFromStorage(): TripDay[] {
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

function loadNotesFromStorage(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(NOTES_KEY) || '{}') }
  catch { return {} }
}

export function useTrip() {
  const [days, setDays] = useState<TripDay[]>(loadDaysFromStorage)
  const [notes, setNotes] = useState<Record<string, string>>(loadNotesFromStorage)
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle')
  const daysRef = useRef<TripDay[]>(days)
  const initialized = useRef(false)

  useEffect(() => { daysRef.current = days }, [days])
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(days)) }, [days])
  useEffect(() => { localStorage.setItem(NOTES_KEY, JSON.stringify(notes)) }, [notes])

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    async function init() {
      setSyncStatus('syncing')
      try {
        const remoteDays = await fetchDays()
        if (remoteDays.length > 0) {
          const migrated = migrateDays(remoteDays)
          setDays(migrated)
          const remoteNotes = await fetchNotes()
          setNotes(remoteNotes)
        } else {
          const localDays = loadDaysFromStorage()
          await seedDays(localDays)
          const localNotes = loadNotesFromStorage()
          for (const [dayId, note] of Object.entries(localNotes)) {
            if (note) await upsertNote(dayId, note)
          }
        }
        setSyncStatus('idle')
      } catch (e) {
        console.warn('Supabase init failed, using local cache', e)
        setSyncStatus('error')
      }
    }
    init()
  }, [])

  const sync = useCallback((dbFn: () => Promise<void>) => {
    setSyncStatus('syncing')
    dbFn()
      .then(() => setSyncStatus('idle'))
      .catch(e => { console.warn('Sync error', e); setSyncStatus('error') })
  }, [])

  const updateActivity = useCallback((dayId: string, actId: string, fields: Partial<Activity>) => {
    const day = daysRef.current.find(d => d.id === dayId)
    const sortOrder = day?.items.findIndex(a => a.id === actId) ?? 0
    const act = day?.items.find(a => a.id === actId)
    const updatedAct = act ? { ...act, ...fields } : null

    setDays(prev =>
      prev.map(d =>
        d.id !== dayId
          ? d
          : { ...d, items: d.items.map(a => (a.id === actId ? { ...a, ...fields } : a)) }
      )
    )
    if (updatedAct) sync(() => upsertActivity(dayId, updatedAct, sortOrder))
  }, [sync])

  const deleteActivity = useCallback((dayId: string, actId: string) => {
    setDays(prev =>
      prev.map(d =>
        d.id !== dayId ? d : { ...d, items: d.items.filter(a => a.id !== actId) }
      )
    )
    sync(() => deleteActivityDb(actId))
  }, [sync])

  const addActivity = useCallback((dayId: string) => {
    const newAct: Activity = { id: `${dayId}-${Date.now()}`, text: '' }
    const sortOrder = daysRef.current.find(d => d.id === dayId)?.items.length ?? 0
    setDays(prev =>
      prev.map(d => d.id !== dayId ? d : { ...d, items: [...d.items, newAct] })
    )
    sync(() => upsertActivity(dayId, newAct, sortOrder))
    return newAct.id
  }, [sync])

  const moveActivity = useCallback((dayId: string, fromIdx: number, toIdx: number) => {
    // Compute reordered list from ref (current committed state) before updating
    const current = daysRef.current.find(d => d.id === dayId)?.items ?? []
    const items = [...current]
    const [moved] = items.splice(fromIdx, 1)
    items.splice(toIdx, 0, moved)

    setDays(prev => prev.map(d => {
      if (d.id !== dayId) return d
      const its = [...d.items]
      const [m] = its.splice(fromIdx, 1)
      its.splice(toIdx, 0, m)
      return { ...d, items: its }
    }))
    sync(() => reorderActivities(dayId, items))
  }, [sync])

  const updateNote = useCallback((dayId: string, text: string) => {
    setNotes(prev => ({ ...prev, [dayId]: text }))
    sync(() => upsertNote(dayId, text))
  }, [sync])

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(NOTES_KEY)
    setDays(SEED_DATA)
    setNotes({})
    sync(() => resetToSeed(SEED_DATA))
  }, [sync])

  const replaceAll = useCallback((newDays: TripDay[]) => {
    setDays(newDays)
    sync(() => seedDays(newDays))
  }, [sync])

  return { days, notes, syncStatus, updateActivity, deleteActivity, addActivity, moveActivity, updateNote, reset, replaceAll }
}
