export type ViewMode = 'list' | 'timeline' | 'map' | 'weather'

const VIEWS: { id: ViewMode; name: string; en: string }[] = [
  { id: 'list',     name: '手帳',  en: 'LIST' },
  { id: 'timeline', name: '行程表', en: 'TIMELINE' },
  { id: 'map',      name: '地圖',  en: 'MAP' },
  { id: 'weather',  name: '天氣',  en: 'WEATHER' },
]

interface Props {
  active: ViewMode
  onChange: (v: ViewMode) => void
}

export function ViewSwitcher({ active, onChange }: Props) {
  return (
    <nav style={s.tabs}>
      {VIEWS.map(v => (
        <button
          key={v.id}
          onClick={() => onChange(v.id)}
          style={{ ...s.tab, ...(active === v.id ? s.tabActive : {}) }}
        >
          <div style={s.tabName}>{v.name}</div>
          <div style={{ ...s.tabEn, ...(active === v.id ? s.tabEnActive : {}) }}>{v.en}</div>
        </button>
      ))}
    </nav>
  )
}

const s = {
  tabs: {
    position: 'relative' as const,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    gap: 5,
    marginBottom: 22,
    zIndex: 1,
  },
  tab: {
    background: 'transparent',
    border: '1px solid rgba(42,37,32,0.25)',
    borderRadius: 0,
    padding: '9px 4px',
    cursor: 'pointer',
    fontFamily: "'Noto Serif TC', serif",
    color: '#6b5d4f',
    transition: 'all 0.2s',
    minHeight: 48,
  },
  tabActive: {
    background: '#2a2520',
    color: '#f3ead8',
    borderColor: '#2a2520',
  },
  tabName: { fontSize: 13, fontWeight: 600 },
  tabEn: {
    fontSize: 7,
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: '0.1em',
    marginTop: 2,
    opacity: 0.5,
    overflow: 'hidden' as const,
    textOverflow: 'ellipsis' as const,
    whiteSpace: 'nowrap' as const,
  },
  tabEnActive: { opacity: 0.6 },
}
