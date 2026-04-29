import { useRef, useEffect } from 'react'
import L from 'leaflet'

const CITIES = [
  { name: 'London',    latlng: [51.505, -0.09]  as [number, number] },
  { name: 'Paris',     latlng: [48.857,  2.352] as [number, number] },
  { name: 'Amsterdam', latlng: [52.374,  4.890] as [number, number] },
]

const ROUTE: [number, number][] = [
  CITIES[0].latlng,
  CITIES[1].latlng,
  CITIES[2].latlng,
  CITIES[0].latlng,
]

function makeIcon(label: string): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `<div style="
      background:#f3ead8;
      border:1px solid rgba(42,37,32,0.5);
      padding:4px 8px;
      font-family:'Noto Serif TC',serif;
      font-size:11px;
      font-weight:600;
      color:#2a2520;
      white-space:nowrap;
      box-shadow:1px 2px 4px rgba(42,37,32,0.15);
    ">${label}</div>`,
    iconAnchor: [0, 0],
  })
}

export function MapView() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, { zoomControl: true }).setView([50.5, 4.5], 5)
    mapRef.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map)

    L.polyline(ROUTE, {
      color: '#8a7558',
      weight: 2,
      dashArray: '6, 6',
      opacity: 0.8,
    }).addTo(map)

    CITIES.forEach(city => {
      L.marker(city.latlng, { icon: makeIcon(city.name) }).addTo(map)
    })

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  return (
    <div style={s.root}>
      <div ref={containerRef} style={s.map} />
      <div style={s.caption}>
        London → Paris → Amsterdam → London
      </div>
    </div>
  )
}

const s = {
  root: { position: 'relative' as const, zIndex: 1 },
  map: {
    height: '55vh',
    minHeight: 260,
    maxHeight: 420,
    border: '1px solid rgba(42,37,32,0.25)',
  },
  caption: {
    marginTop: 10,
    fontSize: 10,
    fontFamily: "'JetBrains Mono', monospace",
    color: '#8a7558',
    letterSpacing: '0.1em',
    textAlign: 'center' as const,
  },
}
