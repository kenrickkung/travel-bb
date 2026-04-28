export interface SubItem {
  id: string
  text: string
}

export interface Activity {
  id: string
  time?: string
  text: string
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

function act(id: string, text: string, time?: string): Activity {
  return { id, text, time }
}

export const SEED_DATA: TripDay[] = [
  {
    id: '2025-06-21',
    date: 'Jun 21',
    dayLabel: 'London Day 1 （星期日）',
    cities: ['London'],
    items: [
      act('ld1-1', 'Heathrow → Express + Uber', '6:30'),
      { id: 'ld1-2', text: 'Greenwich Home and chill', time: '~8:00', subitems: [{ id: 'ld1-2-sub-1', text: 'Jubilee Court' }] },
      { id: 'ld1-3', text: 'Walk around Greenwich', time: '~11:00', subitems: [{ id: 'ld1-3-sub-1', text: 'Greenwich Market' }, { id: 'ld1-3-sub-2', text: 'Cheesecake' }] },
      { id: 'ld1-4', text: 'Hawksmoor Wood Wharf', time: '~13:00', subitems: [{ id: 'ld1-4-sub-1', text: 'Sunday Roast' }] },
      { id: 'ld1-5', text: 'YotelPad Stratford', time: '15:00', subitems: [{ id: 'ld1-5-sub-1', text: 'Check-in' }] },
      { id: 'ld1-6', text: 'London Bridge', time: '16:30', subitems: [{ id: 'ld1-6-sub-1', text: 'The Shard' }] },
      act('ld1-7', 'Millennium Bridge'),
      act('ld1-8-st-paul', 'St Paul'),
      act('ld1-8', 'Haz Dinner'),
    ],
  },
  {
    id: '2025-06-22',
    date: 'Jun 22',
    dayLabel: 'London Day 2 （星期一）',
    cities: ['London'],
    items: [
      { id: 'ld2-1', text: 'Oxford Circus', subitems: [{ id: 'ld2-1-sub-1', text: 'Arome' }, { id: 'ld2-1-sub-2', text: 'Selfridges' }] },
      { id: 'ld2-2', text: 'Ergon Deli', subitems: [{ id: 'ld2-2-sub-1', text: 'Shakshuka Pizza' }] },
      { id: 'ld2-3', text: 'Carnaby Street', subitems: [{ id: 'ld2-3-sub-1', text: 'Liberty' }] },
      { id: 'ld2-4', text: 'Piccadilly Circus', subitems: [{ id: 'ld2-4-sub-1', text: 'Fortnum and Mason' }] },
    ],
  },
  {
    id: '2025-06-23',
    date: 'Jun 23',
    dayLabel: 'London → Paris（星期二）',
    cities: ['Paris'],
    items: [
      act('p1-1', "Eurostar King's Cross", '10:30'),
      act('p1-2', 'Paris Gare du Nord', '13:49'),
      act('p1-3', 'Pullman Bercy', '~14:30'),
      act('p1-4', 'Pedra Alta', '15:00'),
      act('p1-5', 'Eiffel Tower → Cruise Seine'),
    ],
  },
  {
    id: '2025-06-24',
    date: 'Jun 24',
    dayLabel: 'Paris Day 2 （星期三）',
    cities: ['Paris'],
    items: [
      act('p2-1', "Musée de l'Orangerie"),
      act('p2-2', 'Tuileries Garden'),
      { id: 'p2-3', text: 'Louvre', subitems: [{ id: 'p2-3-sub-1', text: 'Late Opening to 9pm' }] },
    ],
  },
  {
    id: '2025-06-25',
    date: 'Jun 25',
    dayLabel: 'Paris Day 3 （星期四）',
    cities: ['Paris'],
    items: [
      act('p3-1', "Musée d'Orsay"),
      act('p3-2', 'Notre-Dame'),
      act('p3-3', 'Sainte-Chapelle'),
      act('p3-4', 'Champs-Élysées'),
      act('p3-5', 'Arc de Triomphe'),
    ],
  },
  {
    id: '2025-06-26',
    date: 'Jun 26',
    dayLabel: 'Paris Day 4 （星期五）',
    cities: ['Paris'],
    items: [
      act('p4-1', 'Versailles'),
      act('p4-2', 'Le Marais 瑪黑區'),
    ],
  },
  {
    id: '2025-06-27',
    date: 'Jun 27',
    dayLabel: 'Paris → Amsterdam（星期六）',
    cities: ['Paris', 'Amsterdam'],
    items: [
      act('p5-4', 'Arrive', '19:50'),
      act('p5-5', 'Ruby Emma Hotel', '20:30'),
    ],
  },
  {
    id: '2025-06-28',
    date: 'Jun 28',
    dayLabel: 'Amsterdam Day 2 （星期日）',
    cities: ['Amsterdam'],
    items: [
      act('a2-1', 'Zaandam day trip'),
      act('a2-2', '風車 Windmills'),
      act('a2-3', 'Cheeeese tasting'),
    ],
  },
  {
    id: '2025-06-29',
    date: 'Jun 29',
    dayLabel: 'Amsterdam Day 3 （星期一）',
    cities: ['Amsterdam'],
    items: [
      act('a3-1', '羊角村 Giethoorn'),
    ],
  },
  {
    id: '2025-06-30',
    date: 'Jun 30',
    dayLabel: 'Amsterdam Day 4 （星期二）',
    cities: ['Amsterdam'],
    items: [
      act('a4-1', 'Rijksmuseum'),
      act('a4-2', 'Van Gogh Museum', '13:00'),
      act('a4-3', 'Albert Cuypmarkt (Lunch)'),
      act('a4-4', 'Ruby Emma Leave', '17:00'),
      act('a4-5', 'Flight', '19:50'),
    ],
  },
  {
    id: '2025-07-01',
    date: 'Jul 1',
    dayLabel: 'London Day 3 （星期三）',
    cities: ['London'],
    items: [
      { id: 'ld3-1', text: 'Tower Bridge', subitems: [{ id: 'ld3-1-sub-1', text: 'by Uber Boat' }] },
      act('ld3-1b', 'Borough Market'),
      act('ld3-2', 'London Eye Park (Jubilee Gardens)'),
      act('ld3-3', 'Big Ben'),
      act('ld3-3b', 'Buckingham Palace'),
      act('ld3-4', "St James's Park"),
      act('ld3-4b', 'Trafalgar Square'),
    ],
  },
  {
    id: '2025-07-02',
    date: 'Jul 2',
    dayLabel: 'Brighton Day（星期四）',
    cities: ['London'],
    items: [
      act('ld4-1', 'Brighton day trip'),
    ],
  },
  {
    id: '2025-07-03',
    date: 'Jul 3',
    dayLabel: 'London Day 4 （星期五）',
    cities: ['London'],
    items: [
      act('ld5-1', 'Notting Hill (Shakshuka + Rainbow House)'),
      act('ld5-2', 'Portobello Road Market (Notting Hill Gate)'),
      act('ld5-3', 'Hyde Park (Queensway Entrance)'),
      act('ld5-4', 'Harrods'),
      act('ld5-5', 'V&A if time'),
    ],
  },
  {
    id: '2025-07-04',
    date: 'Jul 4',
    dayLabel: 'London Day 5 （星期六）',
    cities: ['London'],
    items: [
      act('ld6-1', 'British Museum'),
      act('ld6-2', 'Covent Garden'),
      act('ld6-3', 'Brick Lane'),
      act('ld6-4', 'National Gallery'),
      act("ld6-5", "Regent's Park"),
    ],
  },
]
