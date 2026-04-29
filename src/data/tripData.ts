export interface SubItem {
  id: string
  text: string
}

export interface Activity {
  id: string
  time?: string
  text: string
  emoji?: string
  category?: string
  subitems?: SubItem[]
}

export type City = 'London' | 'Paris' | 'Amsterdam'

export interface TripDay {
  id: string
  date: string
  dayLabel: string
  cities: City[]
  items: Activity[]
}

function act(id: string, text: string, time?: string, emoji?: string, category?: string): Activity {
  return { id, text, time, emoji, category }
}

function actS(id: string, text: string, subitems: SubItem[], time?: string, emoji?: string, category?: string): Activity {
  return { id, text, time, emoji, category, subitems }
}

export const SEED_DATA: TripDay[] = [
  {
    id: '2025-06-21',
    date: 'Jun 21',
    dayLabel: 'London Day 1 （星期日）',
    cities: ['London'],
    items: [
      act('ld1-1', 'Heathrow → Express + Uber', '6:30', '✈️', '交通'),
      actS('ld1-2', 'Greenwich Home and chill', [{ id: 'ld1-2-sub-1', text: 'Jubilee Court' }], '~8:00', '🏠', '住宿'),
      actS('ld1-3', 'Walk around Greenwich', [{ id: 'ld1-3-sub-1', text: 'Greenwich Market' }, { id: 'ld1-3-sub-2', text: 'Cheesecake' }], '~11:00', '🌳', '景點'),
      actS('ld1-4', 'Hawksmoor Wood Wharf', [{ id: 'ld1-4-sub-1', text: 'Sunday Roast' }], '~13:00', '🍖', '餐廳'),
      actS('ld1-5', 'YotelPad Stratford', [{ id: 'ld1-5-sub-1', text: 'Check-in' }], '15:00', '🏨', '住宿'),
      actS('ld1-6', 'London Bridge', [{ id: 'ld1-6-sub-1', text: 'The Shard' }], '16:30', '🏙', '景點'),
      act('ld1-7', 'Millennium Bridge', undefined, '🌉', '景點'),
      act('ld1-8-st-paul', 'St Paul\'s Cathedral', undefined, '⛪', '景點'),
      act('ld1-8', 'Haz Dinner', undefined, '🍝', '餐廳'),
    ],
  },
  {
    id: '2025-06-22',
    date: 'Jun 22',
    dayLabel: 'London Day 2 （星期一）',
    cities: ['London'],
    items: [
      actS('ld2-1', 'Oxford Circus', [{ id: 'ld2-1-sub-1', text: 'Arome' }, { id: 'ld2-1-sub-2', text: 'Selfridges' }], undefined, '🚦', '景點'),
      actS('ld2-2', 'Ergon Deli', [{ id: 'ld2-2-sub-1', text: 'Shakshuka Pizza' }], undefined, '🍳', '餐廳'),
      actS('ld2-3', 'Carnaby Street', [{ id: 'ld2-3-sub-1', text: 'Liberty' }], undefined, '🎨', '購物'),
      actS('ld2-4', 'Piccadilly Circus', [{ id: 'ld2-4-sub-1', text: 'Fortnum and Mason' }], undefined, '💡', '景點'),
    ],
  },
  {
    id: '2025-06-23',
    date: 'Jun 23',
    dayLabel: 'London → Paris（星期二）',
    cities: ['Paris'],
    items: [
      act('p1-1', "Eurostar King's Cross", '10:30', '🚄', '交通'),
      act('p1-2', 'Paris Gare du Nord', '13:49', '🚉', '交通'),
      act('p1-3', 'Pullman Bercy', '~14:30', '🏨', '住宿'),
      act('p1-4', 'Pedra Alta', '15:00', '🥩', '餐廳'),
      act('p1-5', 'Eiffel Tower → Cruise Seine', undefined, '🗼', '景點'),
    ],
  },
  {
    id: '2025-06-24',
    date: 'Jun 24',
    dayLabel: 'Paris Day 2 （星期三）',
    cities: ['Paris'],
    items: [
      act('p2-1', "Musée de l'Orangerie", undefined, '🖼', '景點'),
      act('p2-2', 'Tuileries Garden', undefined, '🌳', '景點'),
      actS('p2-3', 'Louvre', [{ id: 'p2-3-sub-1', text: 'Late Opening to 9pm' }], undefined, '🏛', '景點'),
    ],
  },
  {
    id: '2025-06-25',
    date: 'Jun 25',
    dayLabel: 'Paris Day 3 （星期四）',
    cities: ['Paris'],
    items: [
      act('p3-1', "Musée d'Orsay", undefined, '🖼', '景點'),
      act('p3-2', 'Notre-Dame', undefined, '⛪', '景點'),
      act('p3-3', 'Sainte-Chapelle', undefined, '🪟', '景點'),
      act('p3-4', 'Champs-Élysées', undefined, '🛍', '購物'),
      act('p3-5', 'Arc de Triomphe', undefined, '🏛', '景點'),
    ],
  },
  {
    id: '2025-06-26',
    date: 'Jun 26',
    dayLabel: 'Paris Day 4 （星期五）',
    cities: ['Paris'],
    items: [
      act('p4-1', 'Versailles', undefined, '👑', '景點'),
      act('p4-2', 'Le Marais 瑪黑區', undefined, '🚶', '景點'),
    ],
  },
  {
    id: '2025-06-27',
    date: 'Jun 27',
    dayLabel: 'Paris → Amsterdam（星期六）',
    cities: ['Paris', 'Amsterdam'],
    items: [
      act('p5-1', 'Galeries Lafayette Haussmann', '10:00', '🛍', '購物'),
      act('p5-2', 'Palais Garnier', '12:30', '🎭', '景點'),
      act('p5-3', 'PLAQ!!!', '14:00', '🍫', '餐廳'),
      act('p5-4', 'Depart Paris', '16:25', '🚄', '交通'),
      act('p5-5', 'Arrive Amsterdam', '~19:50', '🚆', '交通'),
      act('p5-6', 'Ruby Emma Hotel', '~20:30', '🏨', '住宿'),
    ],
  },
  {
    id: '2025-06-28',
    date: 'Jun 28',
    dayLabel: 'Amsterdam Day 2 （星期日）',
    cities: ['Amsterdam'],
    items: [
      act('a2-1', 'Zaandam day trip', '10:00', '🚆', '交通'),
      act('a2-2', '風車 Windmills', '12:00', '🌬', '景點'),
      act('a2-3', 'Cheeeese tasting', '14:00', '🧀', '景點'),
    ],
  },
  {
    id: '2025-06-29',
    date: 'Jun 29',
    dayLabel: 'Amsterdam Day 3 （星期一）',
    cities: ['Amsterdam'],
    items: [
      actS('a3-1', '羊角村 Giethoorn', [{ id: 'a3-1-sub-1', text: '水鄉、無車小鎮、運河船' }], '全日', '🛶', '景點'),
    ],
  },
  {
    id: '2025-06-30',
    date: 'Jun 30',
    dayLabel: 'Amsterdam Day 4 （星期二）',
    cities: ['Amsterdam'],
    items: [
      act('a4-1', 'Rijksmuseum', '10:00', '🏛', '景點'),
      actS('a4-2', 'Albert Cuypmarkt', [{ id: 'a4-2-sub-1', text: 'Lunch' }], '12:00', '🥪', '餐廳'),
      act('a4-3', 'Van Gogh Museum', '13:00', '🌻', '景點'),
      act('a4-4', 'Ruby Emma — check-out', '17:00', '🏨', '住宿'),
      act('a4-5', 'Schiphol — Flight ✈️', '19:50', '✈️', '交通'),
    ],
  },
  {
    id: '2025-07-01',
    date: 'Jul 1',
    dayLabel: 'London Day 3 （星期三）',
    cities: ['London'],
    items: [
      actS('ld3-1', 'Tower Bridge', [{ id: 'ld3-1-sub-1', text: 'by Uber Boat' }], '10:00', '🚤', '交通'),
      act('ld3-1b', 'Borough Market', '11:00', '🥖', '餐廳'),
      act('ld3-2', 'London Eye Park', '13:00', '🎡', '景點'),
      act('ld3-3', 'Big Ben', '16:00', '🕰', '景點'),
      act('ld3-3b', 'Buckingham Palace', '16:45', '👑', '景點'),
      act('ld3-4', "St James's Park", '17:30', '🌳', '景點'),
      act('ld3-4b', 'Trafalgar Square', '18:30', '🦁', '景點'),
    ],
  },
  {
    id: '2025-07-02',
    date: 'Jul 2',
    dayLabel: 'Brighton Day（星期四）',
    cities: ['London'],
    items: [
      actS('ld4-1', 'Brighton day trip', [{ id: 'ld4-1-sub-1', text: 'Pier · Pebble Beach · The Lanes' }], '全日', '🌊', '景點'),
    ],
  },
  {
    id: '2025-07-03',
    date: 'Jul 3',
    dayLabel: 'London Day 4 （星期五）',
    cities: ['London'],
    items: [
      actS('ld5-1', 'Notting Hill', [{ id: 'ld5-1-sub-1', text: 'Shakshuka + Rainbow House' }], '10:00', '🍳', '景點'),
      actS('ld5-2', 'Portobello Road Market', [{ id: 'ld5-2-sub-1', text: 'Notting Hill Gate' }], '12:00', '🌈', '購物'),
      actS('ld5-3', 'Hyde Park', [{ id: 'ld5-3-sub-1', text: 'Queensway Entrance' }], '15:00', '🌳', '景點'),
      act('ld5-4', 'Harrods', '17:00', '🛍', '購物'),
      act('ld5-5', 'V&A Museum (if time)', '19:00', '🏛', '景點'),
    ],
  },
  {
    id: '2025-07-04',
    date: 'Jul 4',
    dayLabel: 'London Day 5 （星期六）',
    cities: ['London'],
    items: [
      act('ld6-1', 'British Museum', '10:00', '🏛', '景點'),
      act('ld6-2', 'Covent Garden', '14:30', '🎭', '景點'),
      act('ld6-3', 'Brick Lane', '16:00', '🥯', '餐廳'),
      act('ld6-4', 'National Gallery', undefined, '🖼', '景點'),
      act('ld6-5', "Regent's Park", undefined, '🌳', '景點'),
    ],
  },
]
