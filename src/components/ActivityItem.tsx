import { useRef, useEffect, useState } from 'react'
import { type Activity, type SubItem } from '../data/tripData'

function mapsUrl(text: string, city: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${text} ${city}`)}`
}

// ── Sub-item row ────────────────────────────────────────────────────────────

interface SubItemRowProps {
  item: SubItem
  onUpdate: (text: string) => void
  onDelete: () => void
  autoFocus?: boolean
}

function SubItemRow({ item, onUpdate, onDelete, autoFocus }: SubItemRowProps) {
  const [editing, setEditing] = useState(autoFocus ?? false)
  const [draft, setDraft] = useState(item.text)
  const [hovered, setHovered] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus()
  }, [editing])

  function commit() {
    const trimmed = draft.trim()
    if (trimmed) onUpdate(trimmed)
    else onDelete()
    setEditing(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') commit()
    if (e.key === 'Escape') {
      if (!item.text) onDelete()
      else { setDraft(item.text); setEditing(false) }
    }
  }

  if (editing) {
    return (
      <li style={ss.subItem}>
        <span style={ss.subBullet}>—</span>
        <input
          ref={inputRef}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commit}
          placeholder="add detail…"
          style={ss.subEditInput}
        />
      </li>
    )
  }

  return (
    <li
      style={ss.subItem}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={ss.subBullet}>—</span>
      <span onClick={() => setEditing(true)} style={ss.subText}>
        {item.text || <span style={ss.placeholder}>detail…</span>}
      </span>
      {hovered && (
        <button onClick={onDelete} style={ss.subDeleteBtn} title="Delete">✕</button>
      )}
    </li>
  )
}

// ── Main activity item ──────────────────────────────────────────────────────

interface Props {
  activity: Activity
  city: string
  index: number
  total: number
  onUpdate: (fields: Partial<Activity>) => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  autoFocus?: boolean
}

export function ActivityItem({
  activity,
  city,
  index,
  total,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  autoFocus,
}: Props) {
  const [editing, setEditing] = useState(autoFocus ?? false)
  const [draft, setDraft] = useState(activity.text)
  const [timeDraft, setTimeDraft] = useState(activity.time ?? '')
  const [hovered, setHovered] = useState(false)
  const [focusSubId, setFocusSubId] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus()
  }, [editing])

  function commit() {
    onUpdate({ text: draft, time: timeDraft || undefined })
    setEditing(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') commit()
    if (e.key === 'Escape') {
      setDraft(activity.text)
      setTimeDraft(activity.time ?? '')
      setEditing(false)
    }
  }

  function addSubItem() {
    const newItem: SubItem = { id: `${activity.id}-sub-${Date.now()}`, text: '' }
    onUpdate({ subitems: [...(activity.subitems ?? []), newItem] })
    setFocusSubId(newItem.id)
  }

  function updateSubItem(id: string, text: string) {
    onUpdate({
      subitems: (activity.subitems ?? []).map(s => s.id === id ? { ...s, text } : s),
    })
  }

  function deleteSubItem(id: string) {
    onUpdate({ subitems: (activity.subitems ?? []).filter(s => s.id !== id) })
  }

  const subitems = activity.subitems ?? []

  if (editing) {
    return (
      <li style={s.stopWrap}>
        <div style={s.stop}>
          <input
            value={timeDraft}
            onChange={e => setTimeDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="00:00"
            style={{ ...s.editInput, ...s.timeEditInput }}
          />
          <div style={s.stopBody}>
            <input
              ref={inputRef}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ ...s.editInput, width: '100%' }}
            />
            <div style={s.editHint}>Enter to save · Esc to cancel</div>
          </div>
          <button onMouseDown={e => { e.preventDefault(); commit() }} style={s.commitBtn}>✓</button>
        </div>
      </li>
    )
  }

  return (
    <li
      style={s.stopWrap}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={s.stop}>
        <div style={s.stopTime}>{activity.time ?? ''}</div>
        <div style={s.stopBody}>
          <div style={s.stopTitle}>
            <span onClick={() => setEditing(true)} style={s.stopText}>
              {activity.text || <span style={s.placeholder}>tap to edit…</span>}
            </span>
            {activity.text && (
              <a
                href={mapsUrl(activity.text, city)}
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...s.mapPin, opacity: hovered ? 1 : 0 }}
                title="Open in Google Maps"
              >
                ↗
              </a>
            )}
          </div>
        </div>
        {hovered && (
          <div style={s.actions}>
            <button
              onClick={onMoveUp}
              disabled={index === 0}
              style={{ ...s.actionBtn, opacity: index === 0 ? 0.25 : 1 }}
              title="Move up"
            >↑</button>
            <button
              onClick={onMoveDown}
              disabled={index === total - 1}
              style={{ ...s.actionBtn, opacity: index === total - 1 ? 0.25 : 1 }}
              title="Move down"
            >↓</button>
            <button onClick={() => setEditing(true)} style={s.actionBtn} title="Edit">✎</button>
            <button onClick={onDelete} style={{ ...s.actionBtn, color: '#bf6a3d' }} title="Delete">✕</button>
          </div>
        )}
      </div>

      {subitems.length > 0 && (
        <ul style={ss.subList}>
          {subitems.map(sub => (
            <SubItemRow
              key={sub.id}
              item={sub}
              onUpdate={text => updateSubItem(sub.id, text)}
              onDelete={() => deleteSubItem(sub.id)}
              autoFocus={sub.id === focusSubId}
            />
          ))}
        </ul>
      )}

      {hovered && (
        <button onClick={addSubItem} style={ss.addSubBtn}>＋ note</button>
      )}
    </li>
  )
}

// ── Styles ──────────────────────────────────────────────────────────────────

const s = {
  stopWrap: {
    borderBottom: '1px dotted rgba(42,37,32,0.18)',
    padding: '8px 0',
  },
  stop: {
    display: 'flex',
    gap: 14,
    alignItems: 'flex-start' as const,
    minHeight: 32,
  },
  stopTime: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    color: '#8a7558',
    minWidth: 48,
    paddingTop: 3,
    letterSpacing: '0.05em',
    flexShrink: 0,
  },
  stopBody: { flex: 1, minWidth: 0 },
  stopTitle: { display: 'flex', alignItems: 'center', gap: 6 },
  stopText: { fontSize: 15, fontWeight: 500, lineHeight: 1.4, cursor: 'pointer', flex: 1 },
  placeholder: { color: '#a89880', fontStyle: 'italic' as const },
  mapPin: {
    fontSize: 11,
    color: '#bf6a3d',
    fontFamily: "'JetBrains Mono', monospace",
    transition: 'opacity 0.15s',
    flexShrink: 0,
    textDecoration: 'none',
  },
  actions: { display: 'flex', gap: 2, flexShrink: 0 },
  actionBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: 12,
    color: '#8a7558',
    padding: '0 3px',
    fontFamily: "'JetBrains Mono', monospace",
  },
  editInput: {
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(42,37,32,0.4)',
    fontFamily: "'Noto Serif TC', serif",
    fontSize: 13,
    color: '#2a2520',
    padding: '2px 0',
    outline: 'none',
  },
  timeEditInput: { width: 56, minWidth: 56, flexShrink: 0 },
  editHint: { fontSize: 9, color: '#a89880', marginTop: 4, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em' },
  commitBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: 14,
    color: '#6b5d4f',
    padding: '0 3px',
    alignSelf: 'center' as const,
    flexShrink: 0,
  },
}

const ss = {
  subList: {
    listStyle: 'none',
    padding: '4px 0 2px 62px',
    margin: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 2,
  },
  subItem: {
    display: 'flex',
    alignItems: 'baseline' as const,
    gap: 6,
    fontSize: 12,
    color: '#6b5d4f',
    minHeight: 22,
  },
  subBullet: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    color: '#a89880',
    flexShrink: 0,
  },
  subText: { flex: 1, cursor: 'pointer', lineHeight: 1.4 },
  placeholder: { color: '#a89880', fontStyle: 'italic' as const },
  subDeleteBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: 10,
    color: '#bf6a3d',
    padding: '0 2px',
    flexShrink: 0,
  },
  subEditInput: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(42,37,32,0.3)',
    fontFamily: "'Noto Serif TC', serif",
    fontSize: 12,
    color: '#2a2520',
    padding: '1px 0',
    outline: 'none',
  },
  addSubBtn: {
    background: 'transparent',
    border: 'none',
    padding: '2px 0 0 62px',
    fontSize: 10,
    color: '#a89880',
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: '0.1em',
    cursor: 'pointer',
    display: 'block',
  },
}
