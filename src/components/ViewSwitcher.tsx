export type ViewMode = 'list' | 'timeline'

const VIEWS: { id: ViewMode; name: string; en: string }[] = [
  { id: 'list',     name: '手帳',  en: 'NOTEBOOK' },
  { id: 'timeline', name: '行程表', en: 'TIMELINE' },
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
    gridTemplateColumns: '1fr 1fr',
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
    minHeight: 52,
  },
  tabActive: {
    background: '#2a2520',
    color: '#f3ead8',
    borderColor: '#2a2520',
  },
  tabName: { fontSize: 16, fontWeight: 600 },
  tabEn: {
    fontSize: 8,
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: '0.15em',
    marginTop: 3,
    opacity: 0.7,
  },
  tabEnActive: { opacity: 0.8 },
}
