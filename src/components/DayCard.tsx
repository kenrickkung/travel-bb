import { useState } from 'react'
import { type TripDay, type Activity } from '../data/tripData'
import { ActivityItem } from './ActivityItem'

const NOTES_KEY = 'travel-bb-notes'
const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

function loadNotes(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(NOTES_KEY) || '{}') }
  catch { return {} }
}

function saveNote(dayId: string, value: string) {
  const notes = loadNotes()
  notes[dayId] = value
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes))
}

function getWeekday(dayId: string): string {
  const [y, m, d] = dayId.split('-').map(Number)
  return `星期${WEEKDAYS[new Date(y, m - 1, d).getDay()]}`
}

function formatDate(dayId: string): string {
  return dayId.slice(5).replace('-', '.')
}

interface Props {
  day: TripDay
  onUpdate: (actId: string, fields: Partial<Activity>) => void
  onDelete: (actId: string) => void
  onAdd: () => string
  onMove: (fromIdx: number, toIdx: number) => void
}

export function DayCard({ day, onUpdate, onDelete, onAdd, onMove }: Props) {
  const [newActId, setNewActId] = useState<string | null>(null)
  const [note, setNote] = useState(() => loadNotes()[day.id] || '')

  const cleanLabel = day.dayLabel.replace(/（星期.）/, '').trim()

  function handleAdd() {
    const id = onAdd()
    setNewActId(id)
  }

  function handleNoteChange(v: string) {
    setNote(v)
    saveNote(day.id, v)
  }

  return (
    <article style={s.dayCard}>
      <div style={s.dayHeader}>
        <div style={s.dayDate}>
          <span style={s.dayDateNum}>{formatDate(day.id)}</span>
          <span style={s.dayWeekday}>{getWeekday(day.id)}</span>
        </div>
        <div style={s.dayLabel}>{cleanLabel}</div>
      </div>

      <div style={s.stamp}>
        <div style={s.stampInner}>
          <img
            src={`/travel-bb/photos/${day.id}.jpg`}
            alt={day.dayLabel}
            style={s.stampImg}
            loading="lazy"
          />
        </div>
      </div>

      <ol style={s.stopList}>
        {day.items.map((act, idx) => (
          <ActivityItem
            key={act.id}
            activity={act}
            city={day.cities[0]}
            index={idx}
            total={day.items.length}
            onUpdate={fields => onUpdate(act.id, fields)}
            onDelete={() => onDelete(act.id)}
            onMoveUp={() => onMove(idx, idx - 1)}
            onMoveDown={() => onMove(idx, idx + 1)}
            autoFocus={act.id === newActId}
          />
        ))}
      </ol>

      <button onClick={handleAdd} style={s.addBtn}>＋ add stop</button>

      <div style={s.notesBlock}>
        <div style={s.notesLabel}>筆記</div>
        <textarea
          value={note}
          onChange={e => handleNoteChange(e.target.value)}
          placeholder="今日心得、好吃的、照片打卡..."
          style={s.notesInput}
        />
      </div>
    </article>
  )
}

const s = {
  dayCard: { position: 'relative' as const },
  dayHeader: { marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid rgba(42,37,32,0.2)' },
  dayDate: { display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 },
  dayDateNum: { fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 600, letterSpacing: '0.05em' },
  dayWeekday: { fontSize: 12, color: '#8a7558' },
  dayLabel: { fontSize: 15, fontWeight: 600 },
  stamp: {
    width: 88,
    height: 100,
    background: '#fffdf7',
    border: '1px dashed rgba(42,37,32,0.4)',
    padding: 5,
    float: 'right' as const,
    marginLeft: 12,
    marginBottom: 10,
    transform: 'rotate(2deg)',
    boxShadow: '1px 2px 0 rgba(42,37,32,0.08)',
  },
  stampInner: {
    width: '100%',
    height: '100%',
    border: '1px solid rgba(42,37,32,0.15)',
    overflow: 'hidden' as const,
  },
  stampImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    display: 'block',
    filter: 'sepia(25%) contrast(0.95)',
  },
  stopList: { listStyle: 'none', padding: 0, margin: 0, borderTop: '1px dotted rgba(42,37,32,0.18)' },
  addBtn: {
    display: 'block',
    clear: 'both' as const,
    width: '100%',
    marginTop: 10,
    background: 'transparent',
    border: '1px dashed rgba(42,37,32,0.25)',
    padding: '7px 0',
    fontSize: 11,
    color: '#8a7558',
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: '0.15em',
    cursor: 'pointer',
  },
  notesBlock: { marginTop: 16, clear: 'both' as const },
  notesLabel: { fontSize: 10, color: '#8a7558', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.2em', marginBottom: 6 },
  notesInput: {
    width: '100%',
    minHeight: 52,
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(42,37,32,0.2)',
    fontFamily: "'Noto Serif TC', serif",
    fontSize: 13,
    color: '#2a2520',
    resize: 'vertical' as const,
    padding: '4px 0',
    outline: 'none',
    lineHeight: 1.6,
    backgroundImage: 'repeating-linear-gradient(0deg, transparent 0 22px, rgba(60,40,20,0.12) 22px 23px)',
  },
}
