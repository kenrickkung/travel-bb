import { useRef, useState } from 'react'
import { CityTabs } from './components/CityTabs'
import { DayCard } from './components/DayCard'
import { useTrip } from './hooks/useTrip'
import { type City } from './data/tripData'

const CITY_META: Record<City, {
  dates: string
  hotel: { name: string; area: string; url: string }
  transit: { in: string; out: string }
}> = {
  London: {
    dates: 'Jun 21–23 & Jul 1–4, 2025',
    hotel: { name: 'YotelPad', area: 'Stratford', url: 'https://www.google.com/maps/search/?api=1&query=YotelPad+London+Stratford' },
    transit: { in: 'Heathrow Express → Uber', out: 'Heathrow' },
  },
  Paris: {
    dates: 'Jun 23–27, 2025',
    hotel: { name: 'Pullman Bercy', area: '12th arr.', url: 'https://www.google.com/maps/search/?api=1&query=Pullman+Paris+Centre+Bercy' },
    transit: { in: "Eurostar from King's Cross", out: 'Train to Amsterdam' },
  },
  Amsterdam: {
    dates: 'Jun 27 – Jul 1, 2025',
    hotel: { name: 'Ruby Emma', area: 'Amstel', url: 'https://www.google.com/maps/search/?api=1&query=Ruby+Emma+Hotel+Amsterdam' },
    transit: { in: 'Train from Paris', out: 'Flight 19:50' },
  },
}

export default function App() {
  const [city, setCity] = useState<City>('London')
  const { days, updateActivity, deleteActivity, addActivity, moveActivity, reset, replaceAll } = useTrip()
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleExport() {
    const data = {
      version: 1,
      days,
      notes: JSON.parse(localStorage.getItem('travel-bb-notes') || '{}'),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mamaaaaa-bbbb-europe-2025.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target?.result as string)
        if (Array.isArray(data.days)) replaceAll(data.days)
        if (data.notes) localStorage.setItem('travel-bb-notes', JSON.stringify(data.notes))
      } catch {
        alert('Could not read backup file — make sure it was exported from this app.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }
  const meta = CITY_META[city]
  const visibleDays = days.filter(d => (d.cities ?? []).includes(city))

  return (
    <div style={s.shell}>
      <div style={s.paperTexture} />

      <header style={s.header}>
        <div style={s.kicker}>· 旅遊手帳 ·</div>
        <h1 style={s.title}>mamaaaaa & bbbb</h1>
        <div style={s.subtitle}>✈️ Europe 2025</div>
        <div style={s.dates}>Jun 21 – Jul 4, 2025</div>
        <div style={s.divider}>
          <svg width="100%" height="14" viewBox="0 0 300 14" preserveAspectRatio="none">
            <path d="M 0 7 Q 15 2, 30 7 T 60 7 T 90 7 T 120 7 T 150 7 T 180 7 T 210 7 T 240 7 T 270 7 T 300 7" stroke="#2a2520" strokeWidth="1" fill="none" opacity="0.5"/>
          </svg>
        </div>
      </header>

      <CityTabs active={city} onChange={setCity} />

      <section style={s.cityMeta}>
        <div style={s.cityDates}>{meta.dates}</div>
        <div style={s.metaRow}>
          <span style={s.metaLabel}>住宿</span>
          <span style={s.metaVal}>
            <a href={meta.hotel.url} target="_blank" rel="noopener noreferrer" style={s.hotelLink}>
              {meta.hotel.name}
            </a>
            {' · '}{meta.hotel.area}
          </span>
        </div>
        <div style={s.metaRow}>
          <span style={s.metaLabel}>進</span>
          <span style={s.metaVal}>{meta.transit.in}</span>
        </div>
        <div style={s.metaRow}>
          <span style={s.metaLabel}>出</span>
          <span style={s.metaVal}>{meta.transit.out}</span>
        </div>
      </section>

      <main style={s.days}>
        {visibleDays.map(day => (
          <DayCard
            key={day.id}
            day={day}
            onUpdate={(actId, fields) => updateActivity(day.id, actId, fields)}
            onDelete={actId => deleteActivity(day.id, actId)}
            onAdd={() => addActivity(day.id)}
            onMove={(from, to) => moveActivity(day.id, from, to)}
          />
        ))}
      </main>

      <footer style={s.footer}>
        <div style={s.footerLine}>—— 旅途愉快 ——</div>
        <div style={s.footerSub}>made with ♡ by bb</div>
        <div style={s.footerActions}>
          <button onClick={handleExport} style={s.footerBtn}>↓ export</button>
          <span style={s.footerDot}>·</span>
          <button onClick={() => fileInputRef.current?.click()} style={s.footerBtn}>↑ import</button>
          <span style={s.footerDot}>·</span>
          <button
            onClick={() => { if (confirm('Reset all edits to the original itinerary?')) reset() }}
            style={s.footerBtn}
          >
            reset
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          style={{ display: 'none' }}
        />
      </footer>
    </div>
  )
}

const s = {
  shell: {
    fontFamily: "'Noto Serif TC', 'Noto Sans TC', serif",
    background: '#f3ead8',
    color: '#2a2520',
    minHeight: '100vh',
    position: 'relative' as const,
    padding: '32px 22px 60px',
    maxWidth: 480,
    margin: '0 auto',
  },
  paperTexture: {
    position: 'fixed' as const,
    inset: 0,
    backgroundImage: `
      radial-gradient(circle at 20% 30%, rgba(120,90,50,0.06) 0, transparent 40%),
      radial-gradient(circle at 80% 70%, rgba(120,90,50,0.05) 0, transparent 40%),
      repeating-linear-gradient(0deg, transparent 0, transparent 31px, rgba(60,40,20,0.06) 31px, rgba(60,40,20,0.06) 32px)
    `,
    pointerEvents: 'none' as const,
    zIndex: 0,
  },
  header: { position: 'relative' as const, textAlign: 'center' as const, marginBottom: 18, zIndex: 1 },
  kicker: { fontSize: 11, letterSpacing: '0.4em', color: '#8a7558', marginBottom: 14, fontFamily: "'JetBrains Mono', monospace" },
  title: { fontSize: 32, lineHeight: 1.1, margin: 0, fontWeight: 600, letterSpacing: '0.01em' },
  subtitle: { fontSize: 13, marginTop: 10, color: '#6b5d4f', letterSpacing: '0.05em' },
  dates: { fontSize: 11, marginTop: 8, color: '#8a7558', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em' },
  divider: { marginTop: 18, opacity: 0.7 },
  cityMeta: {
    position: 'relative' as const,
    border: '1px dashed rgba(42,37,32,0.35)',
    padding: '14px 16px',
    marginBottom: 26,
    background: 'rgba(255,253,247,0.4)',
    zIndex: 1,
  },
  cityDates: { fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#8a7558', marginBottom: 10, letterSpacing: '0.1em' },
  metaRow: { display: 'flex', gap: 10, fontSize: 12, marginBottom: 4, alignItems: 'baseline' as const },
  metaLabel: { color: '#8a7558', fontSize: 10, minWidth: 28, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.15em' },
  metaVal: { color: '#2a2520', flex: 1 },
  hotelLink: { color: '#2a2520', textDecoration: 'none', borderBottom: '1px solid rgba(42,37,32,0.3)' },
  days: { position: 'relative' as const, display: 'flex', flexDirection: 'column' as const, gap: 30, zIndex: 1 },
  footer: { position: 'relative' as const, textAlign: 'center' as const, marginTop: 50, zIndex: 1 },
  footerLine: { fontSize: 12, color: '#8a7558', letterSpacing: '0.4em' },
  footerSub: { fontSize: 10, color: '#a89880', marginTop: 6, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em' },
  footerActions: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 14 },
  footerBtn: {
    background: 'transparent',
    border: 'none',
    fontSize: 10,
    color: '#a89880',
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: '0.15em',
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: 0,
  },
  footerDot: { fontSize: 10, color: '#c8b89a' },
}
