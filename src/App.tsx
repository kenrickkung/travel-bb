import { Fragment, useRef, useState, useEffect } from 'react'
import { TimelineView } from './components/TimelineView'
import { ActivityItem } from './components/ActivityItem'
import { useTrip, type SyncStatus } from './hooks/useTrip'
import { useWeather, wmoEmoji } from './hooks/useWeather'
import { type TripDay } from './data/tripData'

// ─── City config ─────────────────────────────────────────────────────────────

type CityId = 'london' | 'paris' | 'amsterdam'
type ViewMode = 'list' | 'timeline'

const CITY_IDS: CityId[] = ['london', 'paris', 'amsterdam']

const CITY_CONFIG: Record<CityId, {
  name: string; en: string
  hotel: { emoji: string; name: string }
  dateRange: string; weatherIcon: string
  dayIds: string[]
}> = {
  london: {
    name: '倫敦', en: 'LONDON',
    hotel: { emoji: '🏨', name: 'YotelPad Stratford' },
    dateRange: 'Jun 21-23 · Jul 1-4', weatherIcon: '☁️',
    dayIds: ['2025-06-21', '2025-06-22', '2025-07-01', '2025-07-02', '2025-07-03', '2025-07-04'],
  },
  paris: {
    name: '巴黎', en: 'PARIS',
    hotel: { emoji: '🏨', name: 'Pullman Bercy' },
    dateRange: 'Jun 23-27', weatherIcon: '☀️',
    dayIds: ['2025-06-23', '2025-06-24', '2025-06-25', '2025-06-26', '2025-06-27'],
  },
  amsterdam: {
    name: '阿姆斯特丹', en: 'AMSTERDAM',
    hotel: { emoji: '🏨', name: 'Ruby Emma' },
    dateRange: 'Jun 27-30', weatherIcon: '⛅',
    dayIds: ['2025-06-27', '2025-06-28', '2025-06-29', '2025-06-30'],
  },
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']
function getWeekday(dayId: string): string {
  const [y, m, d] = dayId.split('-').map(Number)
  return `週${WEEKDAYS[new Date(y, m - 1, d).getDay()]}`
}

function directionsUrl(from: string, to: string, city: string): string {
  return `https://www.google.com/maps/dir/${encodeURIComponent(from + ' ' + city)}/${encodeURIComponent(to + ' ' + city)}`
}

function syncDotColor(status: SyncStatus): string {
  if (status === 'idle') return '#4a9e6a'
  if (status === 'syncing') return '#bf6a3d'
  return '#9e4a4a'
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeCity, setActiveCity] = useState<CityId>('london')
  const [activeDayId, setActiveDayId] = useState<string>('2025-06-21')
  const [view, setView] = useState<ViewMode>('list')
  const [newActId, setNewActId] = useState<string | null>(null)

  const { days, notes, syncStatus, updateActivity, deleteActivity, addActivity, moveActivity, updateNote, reset } = useTrip()
  const { getForDay } = useWeather()
  const chipRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const cityConfig = CITY_CONFIG[activeCity]
  const cityDayIds = cityConfig.dayIds
  const cityDays = cityDayIds
    .map(id => days.find(d => d.id === id))
    .filter((d): d is TripDay => d !== undefined)
  const selectedDay = days.find(d => d.id === activeDayId) ?? cityDays[0]
  const activeDayN = cityDayIds.indexOf(activeDayId) + 1
  const weather = selectedDay ? getForDay(selectedDay.id, selectedDay.cities[0]) : null

  useEffect(() => {
    setActiveDayId(CITY_CONFIG[activeCity].dayIds[0])
  }, [activeCity])

  useEffect(() => {
    chipRefs.current[activeDayId]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [activeDayId])

  function handleAddActivity() {
    if (!selectedDay) return
    const id = addActivity(selectedDay.id)
    setNewActId(id)
  }

  return (
    <div style={s.shell}>

      {/* Brand bar */}
      <div style={s.brandBar}>
        <span style={s.brandBot}>歐洲旅行</span>
        <span style={s.brandSub}>Travel Guide · by bb!</span>
      </div>

      {/* City tabs */}
      <div style={s.cityTabs}>
        {CITY_IDS.map(id => (
          <button
            key={id}
            onClick={() => setActiveCity(id)}
            style={{ ...s.cityTab, ...(activeCity === id ? s.cityTabActive : {}) }}
          >
            {CITY_CONFIG[id].name}
          </button>
        ))}
      </div>

      {/* City header */}
      <div style={s.cityHeader}>
        <div style={s.cityKicker}>{cityConfig.en}</div>
        <h1 style={s.cityName}>{cityConfig.name}</h1>
        <div style={s.cityDates}>
          {cityConfig.dateRange}
          <span style={s.cloudIcon}>{cityConfig.weatherIcon}</span>
        </div>
      </div>

      {/* View switch */}
      <div style={s.viewSwitch}>
        {([
          { id: 'list' as ViewMode, emoji: '📋', label: '清單' },
          { id: 'timeline' as ViewMode, emoji: '⏱', label: '時間軸' },
        ] as const).map(v => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            style={{ ...s.viewBtn, ...(view === v.id ? s.viewBtnActive : {}) }}
          >
            <span style={s.viewBtnEmoji}>{v.emoji}</span>
            {v.label}
          </button>
        ))}
      </div>

      {view === 'list' && selectedDay && (
        <>
          {/* Day chip strip */}
          <div style={s.dayStripWrap}>
            <div style={s.dayStrip}>
              {cityDays.map((day, idx) => {
                const active = day.id === activeDayId
                const wx = getForDay(day.id, day.cities[0])
                return (
                  <button
                    key={day.id}
                    ref={el => { chipRefs.current[day.id] = el }}
                    onClick={() => setActiveDayId(day.id)}
                    style={{ ...s.dayChip, ...(active ? s.dayChipActive : {}) }}
                  >
                    <div style={s.dayChipTop}>Day {idx + 1}</div>
                    <div style={s.dayChipDate}>{day.id.slice(5).replace('-', '/')} {getWeekday(day.id)}</div>
                    {wx && (
                      <div style={s.dayChipWx}>
                        <span>{wmoEmoji(wx.wmoCode)}</span>
                        <span>{wx.tempMin}–{wx.tempMax}°C</span>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Day detail header */}
          <div style={s.dayDetail}>
            <div style={s.dayDetailLeft}>
              <div style={s.dayBig}>Day {activeDayN}</div>
              <div style={s.daySub}>{selectedDay.id.slice(5).replace('-', '/')} {getWeekday(selectedDay.id)}</div>
              {weather && (
                <div style={s.dayWxRow}>
                  <span style={s.dayWxIcon}>{wmoEmoji(weather.wmoCode)}</span>
                  <span style={s.dayWxTemp}>{weather.tempMin}°–{weather.tempMax}°C</span>
                  {weather.precip > 0 && <span style={s.dayWxRain}>💧 {weather.precip}mm</span>}
                </div>
              )}
            </div>
            <div style={s.dayDetailRight}>
              <button onClick={handleAddActivity} style={s.actionPillDark}>＋ 新增項目</button>
            </div>
          </div>

          <div style={s.divider}>◆</div>

          {/* Hotel pin */}
          <div style={s.hotelPin}>
            <span style={s.hotelEmoji}>{cityConfig.hotel.emoji}</span>
            <span style={s.hotelName}>{cityConfig.hotel.name}</span>
          </div>

          {/* Stops */}
          <div style={s.stops}>
            {selectedDay.items.map((act, idx) => (
              <Fragment key={act.id}>
                <ActivityItem
                  activity={act}
                  city={selectedDay.cities[0]}
                  index={idx}
                  total={selectedDay.items.length}
                  onUpdate={fields => updateActivity(selectedDay.id, act.id, fields)}
                  onDelete={() => deleteActivity(selectedDay.id, act.id)}
                  onMoveUp={() => moveActivity(selectedDay.id, idx, idx - 1)}
                  onMoveDown={() => moveActivity(selectedDay.id, idx, idx + 1)}
                  autoFocus={act.id === newActId}
                />
                {idx < selectedDay.items.length - 1 && (
                  <a
                    href={directionsUrl(act.text, selectedDay.items[idx + 1].text, selectedDay.cities[0])}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={s.transitConnector}
                  >
                    <span style={s.transitDot}>·</span>
                    <span style={s.transitBtn}>🚇 查詢交通方式</span>
                    <span style={s.transitDot}>·</span>
                  </a>
                )}
              </Fragment>
            ))}
          </div>

          {/* Notes card */}
          <div style={s.notesCard}>
            <div style={s.notesHeader}>
              <span style={s.notesEmoji}>📝</span>
              <span>Day {activeDayN} 筆記</span>
            </div>
            <textarea
              value={notes[selectedDay.id] ?? ''}
              onChange={e => updateNote(selectedDay.id, e.target.value)}
              placeholder="今日心得、好吃的、照片打卡..."
              style={s.notesInput}
            />
          </div>
        </>
      )}

      {view === 'timeline' && <TimelineView days={days} />}

      {/* Footer */}
      <footer style={s.footer}>
        <div style={s.footerActions}>
          <span
            className={syncStatus === 'syncing' ? 'sync-syncing' : undefined}
            style={{ ...s.syncDot, color: syncDotColor(syncStatus) }}
            title={`sync: ${syncStatus}`}
          >●</span>
          <span style={s.footerDot}>·</span>
          <button
            onClick={() => { if (confirm('Reset all edits to the original itinerary?')) reset() }}
            style={s.footerBtn}
          >reset</button>
        </div>
      </footer>
      <div style={{ height: 30 }} />
    </div>
  )
}

// ─── Styles (Claude Design palette) ─────────────────────────────────────────

const ink = '#2a241d'
const cream = '#f5efe4'
const paper = '#fbf6ec'
const muted = '#8a7d6b'
const line = 'rgba(42,36,29,0.15)'
const accent = '#6b8fb5'

const s: Record<string, React.CSSProperties> = {
  shell: {
    fontFamily: "'Noto Sans TC', sans-serif",
    background: cream,
    color: ink,
    minHeight: '100%',
    maxWidth: 440,
    margin: '0 auto',
    padding: '22px 18px 60px',
    fontSize: 14,
  },

  brandBar: {
    display: 'flex', alignItems: 'baseline', gap: 8,
    marginBottom: 22, paddingBottom: 14,
    borderBottom: `1px solid ${line}`,
  },
  brandTop: { fontFamily: "'Noto Serif TC', serif", fontSize: 18, letterSpacing: '0.05em' },
  brandBot: { fontFamily: "'Noto Serif TC', serif", fontSize: 18, letterSpacing: '0.2em', fontWeight: 600 },
  brandSub: { fontSize: 11, color: muted, letterSpacing: '0.1em', marginLeft: 'auto' },

  cityTabs: { display: 'flex', gap: 6, marginBottom: 14 },
  cityTab: {
    padding: '6px 14px',
    background: 'transparent',
    border: `1px solid ${line}`,
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: 13,
    color: muted,
    letterSpacing: '0.05em',
  },
  cityTabActive: { background: ink, color: cream, borderColor: ink, fontWeight: 600 },

  cityHeader: { marginBottom: 18 },
  cityKicker: { fontSize: 11, color: muted, letterSpacing: '0.4em', marginBottom: 4 },
  cityName: {
    fontSize: 38, fontFamily: "'Noto Serif TC', serif",
    fontWeight: 600, margin: 0, letterSpacing: '0.02em', lineHeight: 1.1,
  },
  cityDates: {
    fontSize: 12, color: muted, marginTop: 8,
    fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.03em',
    display: 'flex', alignItems: 'center', gap: 8,
  },
  cloudIcon: { fontSize: 14 },

  viewSwitch: { display: 'flex', gap: 8, marginBottom: 18 },
  viewBtn: {
    padding: '8px 14px',
    background: paper,
    border: `1px solid ${line}`,
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: 13,
    color: muted,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  viewBtnActive: { background: ink, color: cream, borderColor: ink, fontWeight: 600 },
  viewBtnEmoji: { fontSize: 14 },

  dayStripWrap: { margin: '0 -18px 20px', overflow: 'hidden' },
  dayStrip: {
    display: 'flex', gap: 8, padding: '0 18px',
    overflowX: 'auto', scrollSnapType: 'x mandatory',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none' as unknown as 'none',
  },
  dayChip: {
    minWidth: 110, padding: '10px 12px',
    background: 'transparent',
    border: 'none',
    textAlign: 'left' as const,
    cursor: 'pointer',
    fontFamily: 'inherit',
    color: ink,
    scrollSnapAlign: 'start',
    flexShrink: 0,
  },
  dayChipActive: { background: ink, color: cream },
  dayChipTop: { fontSize: 14, fontWeight: 600, letterSpacing: '0.05em' },
  dayChipDate: { fontSize: 11, marginTop: 2, opacity: 0.85 },
  dayChipWx: {
    display: 'flex', gap: 6, alignItems: 'center',
    fontSize: 11, marginTop: 6,
    fontFamily: "'JetBrains Mono', monospace",
  },

  dayDetail: {
    display: 'grid', gridTemplateColumns: '1fr auto',
    gap: 14, marginBottom: 8,
  },
  dayDetailLeft: {},
  dayBig: { fontSize: 28, fontFamily: "'Noto Serif TC', serif", fontWeight: 600, lineHeight: 1 },
  daySub: { fontSize: 12, color: muted, marginTop: 4, fontFamily: "'JetBrains Mono', monospace" },
  dayWxRow: {
    display: 'flex', alignItems: 'center', gap: 10,
    marginTop: 10, fontSize: 11, color: muted,
    fontFamily: "'JetBrains Mono', monospace",
  },
  dayWxIcon: { fontSize: 18 },
  dayWxTemp: { fontSize: 11, lineHeight: 1.2, color: ink },
  dayWxRain: { color: accent, display: 'flex', alignItems: 'center', gap: 2 },

  dayDetailRight: { display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'stretch', justifyContent: 'flex-start' },
  actionPillDark: {
    background: ink, color: cream, borderColor: ink,
    border: `1px solid ${line}`,
    padding: '7px 12px', fontSize: 12,
    cursor: 'pointer', fontFamily: 'inherit',
    display: 'flex', alignItems: 'center', gap: 6,
    whiteSpace: 'nowrap' as const, justifyContent: 'center',
  },

  divider: { textAlign: 'center' as const, color: muted, opacity: 0.4, margin: '16px 0', fontSize: 10 },

  hotelPin: {
    display: 'flex', alignItems: 'center', gap: 8,
    marginBottom: 14, fontSize: 13, paddingLeft: 4,
  },
  hotelEmoji: { fontSize: 18 },
  hotelName: { fontWeight: 500 },

  stops: { display: 'flex', flexDirection: 'column' },

  transitConnector: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 12, padding: '10px 0',
    color: ink, textDecoration: 'none',
  },
  transitDot: { color: muted, opacity: 0.4, fontFamily: "'JetBrains Mono', monospace" },
  transitBtn: {
    fontSize: 12, color: ink,
    display: 'inline-flex', alignItems: 'center', gap: 4,
  },

  notesCard: {
    marginTop: 22,
    background: paper,
    border: `1px solid ${line}`,
    padding: 14,
  },
  notesHeader: {
    display: 'flex', alignItems: 'center', gap: 8,
    fontSize: 13, fontWeight: 600, marginBottom: 10,
  },
  notesEmoji: { fontSize: 16 },
  notesInput: {
    width: '100%', minHeight: 80,
    background: 'transparent',
    border: `1px solid ${line}`,
    padding: 10,
    fontFamily: "'Noto Sans TC', sans-serif",
    fontSize: 13, color: ink,
    resize: 'vertical' as const,
    outline: 'none', lineHeight: 1.7,
  },

  footer: { textAlign: 'center' as const, marginTop: 40 },
  footerActions: {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    gap: 8, flexWrap: 'wrap' as const,
  },
  syncDot: { fontSize: 10, cursor: 'default' },
  footerBtn: {
    background: 'transparent', border: 'none',
    fontSize: 10, color: muted,
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: '0.15em', cursor: 'pointer',
    textDecoration: 'underline', padding: 0, minHeight: 28,
  },
  footerDot: { fontSize: 10, color: muted },
}
