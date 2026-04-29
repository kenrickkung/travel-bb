import { useRef, useEffect, useState } from 'react'
import { type Activity, type SubItem } from '../data/tripData'

const ink = '#2a241d'
const cream = '#f5efe4'
const paper = '#fbf6ec'
const muted = '#8a7d6b'
const line = 'rgba(42,36,29,0.15)'

function mapsUrl(text: string, city: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${text} ${city}`)}`
}

// ── Edit mode ────────────────────────────────────────────────────────────────

interface EditProps {
  activity: Activity
  onCommit: (fields: Partial<Activity>) => void
  onCancel: () => void
}

function EditCard({ activity, onCommit, onCancel }: EditProps) {
  const [draft, setDraft] = useState(activity.text)
  const [timeDraft, setTimeDraft] = useState(activity.time ?? '')
  const [emojiDraft, setEmojiDraft] = useState(activity.emoji ?? '')
  const [categoryDraft, setCategoryDraft] = useState(activity.category ?? '')
  const [subDrafts, setSubDrafts] = useState<SubItem[]>(activity.subitems ?? [])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  function commit() {
    onCommit({
      text: draft.trim() || activity.text,
      time: timeDraft.trim() || undefined,
      emoji: emojiDraft.trim() || undefined,
      category: categoryDraft.trim() || undefined,
      subitems: subDrafts.filter(s => s.text.trim()),
    })
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') commit()
    if (e.key === 'Escape') onCancel()
  }

  function addSub() {
    setSubDrafts(prev => [...prev, { id: `${activity.id}-sub-${Date.now()}`, text: '' }])
  }

  function updateSub(id: string, text: string) {
    setSubDrafts(prev => prev.map(s => s.id === id ? { ...s, text } : s))
  }

  function removeSub(id: string) {
    setSubDrafts(prev => prev.filter(s => s.id !== id))
  }

  return (
    <article style={{ ...s.stopCard, background: '#fffef9', borderColor: ink }}>
      <div style={s.stopArrows} />
      <div style={s.stopIconBox}>
        <input
          value={emojiDraft}
          onChange={e => setEmojiDraft(e.target.value)}
          placeholder="📍"
          style={s.emojiInput}
          maxLength={4}
        />
      </div>
      <div style={s.stopBody}>
        <div style={s.editRow}>
          <input
            value={timeDraft}
            onChange={e => setTimeDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="時間"
            style={{ ...s.editInput, width: 72 }}
          />
          <input
            value={categoryDraft}
            onChange={e => setCategoryDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="類型"
            style={{ ...s.editInput, flex: 1 }}
          />
        </div>
        <input
          ref={inputRef}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="地點名稱…"
          style={{ ...s.editInput, width: '100%', marginTop: 6, fontSize: 15, fontWeight: 600 }}
        />
        {subDrafts.map(sub => (
          <div key={sub.id} style={s.subEditRow}>
            <input
              value={sub.text}
              onChange={e => updateSub(sub.id, e.target.value)}
              onKeyDown={e => { if (e.key === 'Backspace' && !sub.text) removeSub(sub.id) }}
              placeholder="備註…"
              style={{ ...s.editInput, flex: 1, fontSize: 12 }}
            />
            <button onClick={() => removeSub(sub.id)} style={s.subRemoveBtn}>✕</button>
          </div>
        ))}
        <div style={s.editHint}>Enter 儲存 · Esc 取消</div>
        <div style={s.editActions}>
          <button onClick={addSub} style={s.editActionBtn}>＋ 備註</button>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button onClick={onCancel} style={s.editActionBtn}>取消</button>
            <button onClick={commit} style={{ ...s.editActionBtn, color: ink, fontWeight: 600 }}>儲存 ✓</button>
          </div>
        </div>
      </div>
    </article>
  )
}

// ── Main activity item ────────────────────────────────────────────────────────

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
  activity, city, index, total,
  onUpdate, onDelete, onMoveUp, onMoveDown, autoFocus,
}: Props) {
  const [editing, setEditing] = useState(autoFocus ?? false)
  const subitems = activity.subitems ?? []

  useEffect(() => {
    if (autoFocus) setEditing(true)
  }, [autoFocus])

  if (editing) {
    return (
      <EditCard
        activity={activity}
        onCommit={fields => { onUpdate(fields); setEditing(false) }}
        onCancel={() => {
          if (!activity.text) onDelete()
          setEditing(false)
        }}
      />
    )
  }

  return (
    <article style={s.stopCard}>
      {/* Reorder arrows */}
      <div style={s.stopArrows}>
        <button
          onClick={onMoveUp}
          disabled={index === 0}
          style={{ ...s.stopArrow, opacity: index === 0 ? 0.2 : 0.5 }}
          title="Move up"
        >▲</button>
        <button
          onClick={onMoveDown}
          disabled={index === total - 1}
          style={{ ...s.stopArrow, opacity: index === total - 1 ? 0.2 : 0.5 }}
          title="Move down"
        >▼</button>
      </div>

      {/* Emoji icon box */}
      <div style={s.stopIconBox}>
        <div style={s.stopIconEmoji}>{activity.emoji || '📍'}</div>
      </div>

      {/* Body */}
      <div style={s.stopBody}>
        <div style={s.stopMetaRow}>
          {activity.time && <span style={s.stopTime}>{activity.time}</span>}
          {activity.category && <span style={s.stopCategory}>{activity.category}</span>}
        </div>
        <div style={s.stopTitle}>
          {activity.text ? (
            <a
              href={mapsUrl(activity.text, city)}
              target="_blank"
              rel="noopener noreferrer"
              style={s.stopLink}
            >
              {activity.text}
            </a>
          ) : (
            <span style={s.placeholder} onClick={() => setEditing(true)}>點擊新增…</span>
          )}
        </div>
        {subitems.length > 0 && (
          <div style={s.stopNote}>
            {subitems.map(s => s.text).join(' · ')}
          </div>
        )}
        <div style={s.stopActions}>
          <button onClick={() => setEditing(true)} style={s.stopActionBtn}>編輯</button>
          <button onClick={onDelete} style={{ ...s.stopActionBtn, color: '#bf6a3d' }}>刪除</button>
        </div>
      </div>
    </article>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  stopCard: {
    display: 'grid',
    gridTemplateColumns: '20px 52px 1fr',
    gap: 10,
    padding: '14px 14px 12px',
    background: paper,
    border: `1px solid ${line}`,
    alignItems: 'stretch',
  },

  stopArrows: {
    display: 'flex', flexDirection: 'column',
    justifyContent: 'space-around', gap: 4,
  },
  stopArrow: {
    background: 'transparent', border: 'none',
    cursor: 'pointer', color: muted,
    fontSize: 9, lineHeight: 1, padding: 0,
    fontFamily: 'inherit',
  },

  stopIconBox: {
    background: cream,
    border: `1px solid ${line}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    aspectRatio: '1 / 1',
    alignSelf: 'flex-start',
  },
  stopIconEmoji: { fontSize: 24 },

  stopBody: { minWidth: 0 },
  stopMetaRow: {
    display: 'flex', alignItems: 'baseline',
    gap: 8, marginBottom: 3,
  },
  stopTime: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13, fontWeight: 600, letterSpacing: '0.03em',
  },
  stopCategory: {
    fontSize: 11, color: muted, letterSpacing: '0.15em',
  },
  stopTitle: { fontSize: 15, fontWeight: 600, lineHeight: 1.4 },
  stopLink: {
    color: ink, textDecoration: 'none',
    borderBottom: `1px solid ${line}`,
  },
  placeholder: { color: muted, fontStyle: 'italic', cursor: 'pointer' },
  stopNote: { fontSize: 12, color: muted, marginTop: 4, lineHeight: 1.5 },
  stopActions: {
    display: 'flex', gap: 14,
    marginTop: 8, justifyContent: 'flex-end',
  },
  stopActionBtn: {
    background: 'transparent', border: 'none',
    padding: 0, fontSize: 11, color: muted,
    cursor: 'pointer', fontFamily: 'inherit',
    letterSpacing: '0.05em',
  },

  // Edit mode
  emojiInput: {
    width: '100%', textAlign: 'center' as const,
    background: 'transparent', border: 'none',
    fontSize: 22, outline: 'none', cursor: 'text',
    padding: 0,
  },
  editRow: { display: 'flex', gap: 8 },
  subEditRow: { display: 'flex', gap: 6, alignItems: 'center', marginTop: 4 },
  editInput: {
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid ${line}`,
    fontFamily: "'Noto Sans TC', sans-serif",
    fontSize: 13, color: ink,
    padding: '2px 0', outline: 'none',
  },
  subRemoveBtn: {
    background: 'transparent', border: 'none',
    fontSize: 10, color: muted, cursor: 'pointer', padding: '0 2px',
  },
  editHint: {
    fontSize: 9, color: muted, marginTop: 6,
    fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em',
  },
  editActions: { display: 'flex', alignItems: 'center', marginTop: 8 },
  editActionBtn: {
    background: 'transparent', border: 'none',
    fontSize: 11, color: muted, cursor: 'pointer',
    fontFamily: 'inherit', padding: '2px 4px',
  },
}
