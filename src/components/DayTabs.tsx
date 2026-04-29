import { useEffect, useRef } from 'react'
import { type TripDay, type City } from '../data/tripData'

const CITY_COLOR: Record<City, string> = {
  London: '#4a7c9e',
  Paris: '#9e4a4a',
  Amsterdam: '#4a9e6a',
}

function tabDate(id: string): string {
  return id.slice(5).replace('-', '.')
}

interface Props {
  days: TripDay[]
  active: string
  onChange: (dayId: string) => void
}

export function DayTabs({ days, active, onChange }: Props) {
  const activeRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [active])

  return (
    <nav style={s.nav}>
      {days.map(day => {
        const isActive = day.id === active
        const primaryCity = day.cities[0]
        const accentColor = CITY_COLOR[primaryCity] ?? '#8a7558'

        return (
          <button
            key={day.id}
            ref={isActive ? activeRef : undefined}
            onClick={() => onChange(day.id)}
            style={{
              ...s.tab,
              ...(isActive ? s.tabActive : {}),
              borderBottom: isActive
                ? `3px solid ${accentColor}`
                : `3px solid rgba(42,37,32,0.1)`,
            }}
          >
            <span style={isActive ? s.dateActive : s.date}>{tabDate(day.id)}</span>
          </button>
        )
      })}
    </nav>
  )
}

const s = {
  nav: {
    position: 'relative' as const,
    display: 'flex',
    gap: 4,
    overflowX: 'auto' as const,
    marginBottom: 22,
    zIndex: 1,
    paddingBottom: 2,
  },
  tab: {
    flexShrink: 0,
    background: 'transparent',
    border: 'none',
    borderRadius: 0,
    padding: '8px 10px 6px',
    cursor: 'pointer',
    fontFamily: "'JetBrains Mono', monospace",
    transition: 'background 0.15s',
    minHeight: 44,
    outline: 'none',
  },
  tabActive: {
    background: 'rgba(42,37,32,0.06)',
  },
  date: {
    fontSize: 11,
    color: '#8a7558',
    letterSpacing: '0.08em',
    display: 'block',
  },
  dateActive: {
    fontSize: 11,
    color: '#2a2520',
    letterSpacing: '0.08em',
    fontWeight: 600,
    display: 'block',
  },
}
