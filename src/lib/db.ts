import { supabase } from './supabase'
import { type TripDay, type Activity, type City } from '../data/tripData'

export async function fetchDays(): Promise<TripDay[]> {
  const { data, error } = await supabase
    .from('trip_days')
    .select(`
      id, date, day_label, cities, sort_order,
      activities ( id, day_id, time, text, sort_order,
        subitems ( id, activity_id, text, sort_order )
      )
    `)
    .order('sort_order')

  if (error) throw error
  if (!data || data.length === 0) return []

  return (data as any[]).map(row => ({
    id: row.id,
    date: row.date,
    dayLabel: row.day_label,
    cities: row.cities as City[],
    items: ((row.activities || []) as any[])
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((act: any) => ({
        id: act.id,
        time: act.time ?? undefined,
        text: act.text,
        subitems: ((act.subitems || []) as any[])
          .sort((a: any, b: any) => a.sort_order - b.sort_order)
          .map((sub: any) => ({ id: sub.id, text: sub.text })),
      })),
  }))
}

export async function fetchNotes(): Promise<Record<string, string>> {
  const { data, error } = await supabase.from('day_notes').select('day_id, note')
  if (error) throw error
  const notes: Record<string, string> = {}
  ;(data || []).forEach((row: any) => { notes[row.day_id] = row.note })
  return notes
}

export async function upsertActivity(dayId: string, act: Activity, sortOrder: number): Promise<void> {
  const { error } = await supabase.from('activities').upsert({
    id: act.id,
    day_id: dayId,
    time: act.time ?? null,
    text: act.text,
    sort_order: sortOrder,
    updated_at: new Date().toISOString(),
  })
  if (error) throw error

  // Replace subitems: delete all, re-insert
  await supabase.from('subitems').delete().eq('activity_id', act.id)
  if (act.subitems && act.subitems.length > 0) {
    const { error: subErr } = await supabase.from('subitems').insert(
      act.subitems.map((sub, i) => ({
        id: sub.id,
        activity_id: act.id,
        text: sub.text,
        sort_order: i,
      }))
    )
    if (subErr) throw subErr
  }
}

export async function deleteActivityDb(activityId: string): Promise<void> {
  const { error } = await supabase.from('activities').delete().eq('id', activityId)
  if (error) throw error
}

export async function reorderActivities(dayId: string, activities: Activity[]): Promise<void> {
  if (activities.length === 0) return
  const { error } = await supabase.from('activities').upsert(
    activities.map((act, i) => ({
      id: act.id,
      day_id: dayId,
      time: act.time ?? null,
      text: act.text,
      sort_order: i,
      updated_at: new Date().toISOString(),
    }))
  )
  if (error) throw error
}

export async function upsertNote(dayId: string, note: string): Promise<void> {
  const { error } = await supabase.from('day_notes').upsert({
    day_id: dayId,
    note,
    updated_at: new Date().toISOString(),
  })
  if (error) throw error
}

export async function seedDays(days: TripDay[]): Promise<void> {
  const { error: daysErr } = await supabase.from('trip_days').upsert(
    days.map((day, i) => ({
      id: day.id,
      date: day.date,
      day_label: day.dayLabel,
      cities: day.cities,
      sort_order: i,
      updated_at: new Date().toISOString(),
    }))
  )
  if (daysErr) throw daysErr

  for (const day of days) {
    if (day.items.length === 0) continue
    const { error: actsErr } = await supabase.from('activities').upsert(
      day.items.map((act, i) => ({
        id: act.id,
        day_id: day.id,
        time: act.time ?? null,
        text: act.text,
        sort_order: i,
        updated_at: new Date().toISOString(),
      }))
    )
    if (actsErr) throw actsErr

    const allSubs = day.items.flatMap(act =>
      (act.subitems || []).map((sub, i) => ({
        id: sub.id,
        activity_id: act.id,
        text: sub.text,
        sort_order: i,
      }))
    )
    if (allSubs.length > 0) {
      const { error: subsErr } = await supabase.from('subitems').upsert(allSubs)
      if (subsErr) throw subsErr
    }
  }

  const { error: notesErr } = await supabase.from('day_notes').upsert(
    days.map(day => ({ day_id: day.id, note: '', updated_at: new Date().toISOString() })),
    { onConflict: 'day_id', ignoreDuplicates: true }
  )
  if (notesErr) throw notesErr
}

export async function resetToSeed(days: TripDay[]): Promise<void> {
  const { data } = await supabase.from('trip_days').select('id')
  const ids = ((data || []) as any[]).map(d => d.id)
  if (ids.length > 0) {
    await supabase.from('trip_days').delete().in('id', ids)
  }
  await seedDays(days)
}
