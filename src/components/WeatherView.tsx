import { useState, useEffect } from 'react'
import { type City } from '../data/tripData'

const CITIES: { id: City; name: string; lat: number; lon: number; tz: string }[] = [
  { id: 'London',    name: '倫敦',     lat: 51.51, lon: -0.13, tz: 'Europe/London' },
  { id: 'Paris',     name: '巴黎',     lat: 48.85, lon:  2.35, tz: 'Europe/Paris' },
  { id: 'Amsterdam', name: '阿姆斯特丹', lat: 52.37, lon:  4.89, tz: 'Europe/Amsterdam' },
]

type Status = 'loading' | 'ok' | 'error'

interface DayWeather {
  date: string
  tempMax: number
  tempMin: number
  wmoCode: number
  precip: number
}

function wmoEmoji(code: number): string {
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

function fmtDate(iso: string): string {
  const d = new Date(iso + 'T12:00:00')
  return `${d.toLocaleString('en', { month: 'short' })} ${d.getDate()}`
}

async function fetchWeather(lat: number, lon: number, tz: string): Promise<DayWeather[]> {
  const url = new URL('https://archive-api.open-meteo.com/v1/archive')
  url.searchParams.set('latitude', String(lat))
  url.searchParams.set('longitude', String(lon))
  url.searchParams.set('start_date', '2025-06-21')
  url.searchParams.set('end_date', '2025-07-04')
  url.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum')
  url.searchParams.set('timezone', tz)

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error('fetch failed')
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

export function WeatherView() {
  const [active, setActive] = useState<City>('London')
  const [status, setStatus] = useState<Status>('loading')
  const [data, setData] = useState<Record<City, DayWeather[]>>({
    London: [], Paris: [], Amsterdam: [],
  })

  useEffect(() => {
    setStatus('loading')
    Promise.all(CITIES.map(c => fetchWeather(c.lat, c.lon, c.tz)))
      .then(([lon, par, ams]) => {
        setData({ London: lon, Paris: par, Amsterdam: ams })
        setStatus('ok')
      })
      .catch(() => setStatus('error'))
  }, [])

  return (
    <div style={s.root}>
      {/* City switcher */}
      <nav style={s.tabs}>
        {CITIES.map(c => (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            style={{ ...s.tab, ...(active === c.id ? s.tabActive : {}) }}
          >
            <div style={s.tabName}>{c.name}</div>
          </button>
        ))}
      </nav>

      {status === 'loading' && (
        <div style={s.center}>
          <span style={s.loading}>載入中...</span>
        </div>
      )}

      {status === 'error' && (
        <div style={s.errorBox}>
          <span>無法載入天氣資料</span>
        </div>
      )}

      {status === 'ok' && (
        <div style={s.list}>
          {data[active].map(day => (
            <div key={day.date} style={s.dayRow}>
              <span style={s.emoji}>{wmoEmoji(day.wmoCode)}</span>
              <span style={s.date}>{fmtDate(day.date)}</span>
              <span style={s.temps}>
                <span style={s.tempMax}>↑ {day.tempMax}°</span>
                <span style={s.tempMin}> ↓ {day.tempMin}°</span>
              </span>
              {day.precip > 0 && (
                <span style={s.precip}>💧 {day.precip}mm</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const s = {
  root: { position: 'relative' as const, zIndex: 1 },
  tabs: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 6,
    marginBottom: 18,
  },
  tab: {
    background: 'transparent',
    border: '1px solid rgba(42,37,32,0.25)',
    padding: '10px 6px',
    cursor: 'pointer',
    fontFamily: "'Noto Serif TC', serif",
    color: '#6b5d4f',
    transition: 'all 0.2s',
    minHeight: 44,
  },
  tabActive: {
    background: '#2a2520',
    color: '#f3ead8',
    borderColor: '#2a2520',
  },
  tabName: { fontSize: 14, fontWeight: 600 },
  center: { display: 'flex', justifyContent: 'center', padding: '40px 0' },
  loading: { fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#8a7558' },
  errorBox: {
    border: '1px dashed rgba(42,37,32,0.35)',
    padding: '24px 16px',
    textAlign: 'center' as const,
    fontSize: 13,
    color: '#8a7558',
  },
  list: { display: 'flex', flexDirection: 'column' as const },
  dayRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 0',
    borderBottom: '1px dotted rgba(42,37,32,0.18)',
    flexWrap: 'wrap' as const,
  },
  emoji: { fontSize: 16, width: 24, flexShrink: 0 },
  date: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    color: '#8a7558',
    width: 52,
    flexShrink: 0,
    letterSpacing: '0.05em',
  },
  temps: { flex: 1, fontSize: 13, minWidth: 100 },
  tempMax: { color: '#bf6a3d', fontWeight: 600 },
  tempMin: { color: '#4a7c9e' },
  precip: { fontSize: 11, color: '#4a7c9e', fontFamily: "'JetBrains Mono', monospace" },
}
