import { type TripDay, type City } from '../data/tripData'

const CITY_COLOR: Record<City, string> = {
  London: '#4a7c9e',
  Paris: '#9e4a4a',
  Amsterdam: '#4a9e6a',
}

const CITY_LABEL: Record<City, string> = {
  London: '倫敦',
  Paris: '巴黎',
  Amsterdam: '阿姆',
}

function formatDate(id: string): string {
  return id.slice(5).replace('-', '.')
}

interface Props {
  days: TripDay[]
}

export function TimelineView({ days }: Props) {
  return (
    <div style={s.root}>
      {days.map((day, idx) => {
        const dotColor = CITY_COLOR[day.cities[0]] ?? '#8a7558'
        const isLast = idx === days.length - 1
        const cleanLabel = day.dayLabel.replace(/（星期.）/, '').trim()

        return (
          <div key={day.id} style={s.row}>
            {/* Left gutter */}
            <div style={s.gutter}>
              <div style={{ ...s.dot, background: dotColor }} />
              {!isLast && <div style={s.line} />}
            </div>

            {/* Right content */}
            <div style={s.content}>
              <div style={s.dayHead}>
                <span style={s.dateLabel}>{formatDate(day.id)}</span>
                <div style={s.cityPills}>
                  {day.cities.map(c => (
                    <span
                      key={c}
                      style={{ ...s.pill, background: CITY_COLOR[c], color: '#fff' }}
                    >
                      {CITY_LABEL[c]}
                    </span>
                  ))}
                </div>
              </div>
              <div style={s.dayTitle}>{cleanLabel}</div>
              <ul style={s.actList}>
                {day.items.map(act => (
                  <li key={act.id} style={s.actItem}>
                    {act.time && <span style={s.actTime}>{act.time}</span>}
                    <span style={s.actText}>{act.text}</span>
                    {act.subitems && act.subitems.length > 0 && (
                      <ul style={s.subList}>
                        {act.subitems.map(sub => (
                          <li key={sub.id} style={s.subItem}>— {sub.text}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )
      })}
    </div>
  )
}

const s = {
  root: {
    position: 'relative' as const,
    paddingBottom: 20,
    zIndex: 1,
  },
  row: {
    display: 'flex',
    gap: 14,
    marginBottom: 0,
  },
  gutter: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    width: 22,
    flexShrink: 0,
    paddingTop: 4,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    flexShrink: 0,
    border: '2px solid #f3ead8',
    boxSizing: 'border-box' as const,
    zIndex: 1,
  },
  line: {
    width: 1,
    flex: 1,
    minHeight: 24,
    borderLeft: '1px dashed rgba(42,37,32,0.22)',
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingBottom: 24,
    minWidth: 0,
  },
  dayHead: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
    flexWrap: 'wrap' as const,
  },
  dateLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    color: '#8a7558',
    letterSpacing: '0.08em',
  },
  cityPills: {
    display: 'flex',
    gap: 4,
    flexWrap: 'wrap' as const,
  },
  pill: {
    fontSize: 9,
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: '0.08em',
    padding: '2px 6px',
    borderRadius: 2,
  },
  dayTitle: {
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 8,
    lineHeight: 1.3,
  },
  actList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 5,
  },
  actItem: {
    fontSize: 12,
    color: '#2a2520',
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 5,
    alignItems: 'baseline',
  },
  actTime: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    color: '#8a7558',
    minWidth: 32,
  },
  actText: {
    flex: 1,
    minWidth: 0,
  },
  subList: {
    listStyle: 'none',
    padding: '2px 0 0 16px',
    margin: 0,
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 2,
  },
  subItem: {
    fontSize: 11,
    color: '#8a7558',
  },
}
