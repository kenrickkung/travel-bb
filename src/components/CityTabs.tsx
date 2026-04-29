import { type City } from '../data/tripData'

const CITIES: { id: City; name: string; en: string }[] = [
  { id: 'London',    name: '倫敦',    en: 'LONDON' },
  { id: 'Paris',     name: '巴黎',    en: 'PARIS' },
  { id: 'Amsterdam', name: '阿姆斯特丹', en: 'AMS' },
]

interface Props {
  active: City
  onChange: (city: City) => void
}

export function CityTabs({ active, onChange }: Props) {
  return (
    <nav style={s.tabs}>
      {CITIES.map(c => (
        <button
          key={c.id}
          onClick={() => onChange(c.id)}
          style={{ ...s.tab, ...(active === c.id ? s.tabActive : {}) }}
        >
          <div style={s.tabName}>{c.name}</div>
          <div style={{ ...s.tabEn, ...(active === c.id ? s.tabEnActive : {}) }}>{c.en}</div>
        </button>
      ))}
    </nav>
  )
}

const s = {
  tabs: {
    position: 'relative' as const,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 6,
    marginBottom: 22,
    zIndex: 1,
  },
  tab: {
    background: 'transparent',
    border: '1px solid rgba(42,37,32,0.25)',
    borderRadius: 0,
    padding: '10px 6px',
    cursor: 'pointer',
    fontFamily: "'Noto Serif TC', serif",
    color: '#6b5d4f',
    transition: 'all 0.2s',
  },
  tabActive: {
    background: '#2a2520',
    color: '#f3ead8',
    borderColor: '#2a2520',
  },
  tabName: { fontSize: 16, fontWeight: 600 },
  tabEn: { fontSize: 9, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.15em', marginTop: 2, opacity: 0.7 },
  tabEnActive: { opacity: 0.8 },
}
