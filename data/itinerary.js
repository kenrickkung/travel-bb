// Trip data updated to match TABI-style UI: weather, categories, emoji icons per stop

const TRIP = {
  brand: "旅 · TABI",
  title: "Travel Guide",
  subtitle: "by bb!",
  hotelCount: 3,
  memberCount: 2,
  cities: [
    {
      id: "london",
      name: "倫敦",
      en: "LONDON",
      dateRange: "2026-06-21 — 2026-07-04 · 9 天",
      weatherIcon: "☁️",
      hotel: { emoji: "🏨", name: "YotelPad London Bridge", area: "London Bridge" },
      days: [
        {
          n: 1, date: "06.21", weekday: "週日", weather: "🌧", tempMin: 12, tempMax: 18, rain: 60,
          label: "倫敦抵達日",
          stops: [
            { time: "06:30", category: "交通", emoji: "✈️", title: "Heathrow 抵達", note: "Heathrow Express + Uber → Greenwich", map: "Heathrow Airport London" },
            { time: "08:00", category: "住宿", emoji: "🏠", title: "Greenwich Home", note: "回家放鬆休息", map: "Greenwich London" },
            { time: "11:00", category: "景點", emoji: "🌳", title: "Greenwich Park 散步", note: "舊皇家天文台、本初子午線", map: "Greenwich Park London" },
            { time: "13:00", category: "餐廳", emoji: "🍖", title: "Hawksmoor Sunday Roast", note: "經典英式週日烤肉", map: "Hawksmoor Borough London" },
            { time: "15:00", category: "住宿", emoji: "🏨", title: "YotelPad Check-in", note: "最早 15:00 入住", map: "YotelPad London" },
            { time: "16:30", category: "景點", emoji: "🏙", title: "London Bridge / Shard", map: "The Shard London" },
            { time: "17:30", category: "景點", emoji: "🌉", title: "Millennium Bridge → St Paul's", map: "Millennium Bridge London" },
            { time: "19:30", category: "餐廳", emoji: "🍝", title: "Haz Restaurant", note: "土耳其料理晚餐", map: "Haz Restaurant London" }
          ]
        },
        {
          n: 2, date: "06.22", weekday: "週一", weather: "⛅", tempMin: 14, tempMax: 20, rain: 20,
          label: "整日逛街 · West End",
          stops: [
            { time: "10:00", category: "餐廳", emoji: "🥐", title: "Full Arome", note: "早午餐", map: "Full Arome London" },
            { time: "11:30", category: "購物", emoji: "🛍", title: "Selfridges", map: "Selfridges London" },
            { time: "13:00", category: "景點", emoji: "🚦", title: "Oxford Circus", map: "Oxford Circus London" },
            { time: "13:30", category: "餐廳", emoji: "🍳", title: "Ergon Deli", note: "Shashuka Pizza", map: "Ergon Deli London" },
            { time: "15:00", category: "購物", emoji: "🎨", title: "Carnaby Street", map: "Carnaby Street London" },
            { time: "16:00", category: "購物", emoji: "🏛", title: "Liberty London", map: "Liberty London" },
            { time: "17:00", category: "景點", emoji: "💡", title: "Piccadilly Circus", map: "Piccadilly Circus London" },
            { time: "18:00", category: "購物", emoji: "🫖", title: "Fortnum & Mason", map: "Fortnum and Mason London" },
            { time: "19:30", category: "餐廳", emoji: "🍽", title: "Foodd 晚餐", map: "Foodd London" }
          ]
        },
        {
          n: 3, date: "07.01", weekday: "週三", weather: "☀️", tempMin: 16, tempMax: 23, rain: 10,
          label: "經典倫敦地標",
          stops: [
            { time: "10:00", category: "交通", emoji: "🚤", title: "Uber Boat → Tower Bridge", map: "Tower Bridge London" },
            { time: "11:00", category: "餐廳", emoji: "🥖", title: "Borough Market", map: "Borough Market London" },
            { time: "13:00", category: "景點", emoji: "🏙", title: "The Shard 觀景", map: "The Shard London" },
            { time: "15:00", category: "景點", emoji: "🎡", title: "London Eye Park", map: "London Eye" },
            { time: "16:00", category: "景點", emoji: "🕰", title: "Big Ben", map: "Big Ben London" },
            { time: "16:45", category: "景點", emoji: "👑", title: "Buckingham Palace", map: "Buckingham Palace London" },
            { time: "17:30", category: "景點", emoji: "🌳", title: "St James's Park", map: "St James Park London" },
            { time: "18:30", category: "景點", emoji: "🦁", title: "Trafalgar Square", map: "Trafalgar Square London" }
          ]
        },
        {
          n: 4, date: "07.02", weekday: "週四", weather: "⛅", tempMin: 15, tempMax: 21, rain: 30,
          label: "Brighton 一日遊",
          tag: "海邊一日",
          stops: [
            { time: "全日", category: "景點", emoji: "🌊", title: "Brighton 海邊小鎮", note: "棧橋、卵石灘、The Lanes 散步", map: "Brighton UK" }
          ]
        },
        {
          n: 5, date: "07.03", weekday: "週五", weather: "☀️", tempMin: 17, tempMax: 24, rain: 5,
          label: "Notting Hill 整日",
          stops: [
            { time: "10:00", category: "餐廳", emoji: "🍳", title: "Notting Hill 早午餐", note: "Shashuka + Rainbow House", map: "Notting Hill London" },
            { time: "12:00", category: "購物", emoji: "🌈", title: "Portobello Road", note: "Notting Hill Gate", map: "Portobello Road Market" },
            { time: "15:00", category: "景點", emoji: "🌳", title: "Hyde Park", note: "Queensway 入口進", map: "Hyde Park London Queensway" },
            { time: "17:00", category: "購物", emoji: "🛍", title: "Harrods", map: "Harrods London" },
            { time: "19:00", category: "景點", emoji: "🏛", title: "V&A Museum（如有時間）", map: "Victoria and Albert Museum London" }
          ]
        },
        {
          n: 6, date: "07.04", weekday: "週六", weather: "⛅", tempMin: 16, tempMax: 22, rain: 15,
          label: "倫敦最後一天",
          stops: [
            { time: "10:00", category: "景點", emoji: "🏛", title: "British Museum", map: "British Museum London" },
            { time: "13:00", category: "購物", emoji: "🚇", title: "Tottenham Court Road", map: "Tottenham Court Road London" },
            { time: "14:30", category: "景點", emoji: "🎭", title: "Covent Garden", map: "Covent Garden London" },
            { time: "16:00", category: "餐廳", emoji: "🥯", title: "Brick Lane Bagel", map: "Beigel Bake Brick Lane London" },
            { time: "備案", category: "景點", emoji: "🖼", title: "National Gallery", map: "National Gallery London" },
            { time: "備案", category: "景點", emoji: "🌳", title: "Regent's Park", map: "Regents Park London" }
          ]
        }
      ]
    },
    {
      id: "paris",
      name: "巴黎",
      en: "PARIS",
      dateRange: "2026-06-23 — 2026-06-27 · 5 天",
      weatherIcon: "☀️",
      hotel: { emoji: "🏨", name: "Pullman Paris Bercy", area: "Bercy" },
      days: [
        {
          n: 1, date: "06.23", weekday: "週二", weather: "☀️", tempMin: 18, tempMax: 26, rain: 5,
          label: "巴黎抵達日",
          stops: [
            { time: "10:30", category: "交通", emoji: "🚄", title: "Eurostar · King's Cross", map: "St Pancras International London" },
            { time: "13:49", category: "交通", emoji: "🚉", title: "Paris Gare du Nord 抵達", map: "Gare du Nord Paris" },
            { time: "14:30", category: "住宿", emoji: "🏨", title: "Pullman Bercy Check-in", map: "Pullman Paris Bercy" },
            { time: "15:00", category: "餐廳", emoji: "🥩", title: "Pedra Alta", note: "葡式餐廳午餐", map: "Pedra Alta Paris" },
            { time: "17:00", category: "景點", emoji: "🗼", title: "艾菲爾鐵塔", map: "Eiffel Tower Paris" },
            { time: "19:30", category: "景點", emoji: "⛴", title: "塞納河遊船", map: "Seine River Cruise Paris" }
          ]
        },
        {
          n: 2, date: "06.24", weekday: "週三", weather: "⛅", tempMin: 17, tempMax: 24, rain: 20,
          label: "美術館日（羅浮宮夜場）",
          stops: [
            { time: "10:00", category: "景點", emoji: "🖼", title: "橘園美術館", note: "Musée de l'Orangerie", map: "Musee de l Orangerie Paris" },
            { time: "12:30", category: "景點", emoji: "🌳", title: "杜樂麗花園", note: "Tuileries", map: "Jardin des Tuileries Paris" },
            { time: "15:00", category: "景點", emoji: "🏛", title: "羅浮宮", note: "週三延長至 21:00", map: "Louvre Museum Paris" }
          ]
        },
        {
          n: 3, date: "06.25", weekday: "週四", weather: "☀️", tempMin: 19, tempMax: 27, rain: 5,
          label: "古蹟整日",
          stops: [
            { time: "10:00", category: "景點", emoji: "🖼", title: "奧賽美術館", note: "週一休館", map: "Musee d Orsay Paris" },
            { time: "13:00", category: "景點", emoji: "⛪", title: "巴黎聖母院", map: "Notre Dame Paris" },
            { time: "14:30", category: "景點", emoji: "🪟", title: "聖禮拜堂", note: "Sainte-Chapelle", map: "Sainte Chapelle Paris" },
            { time: "16:30", category: "購物", emoji: "🛍", title: "香榭麗舍大道", map: "Champs Elysees Paris" },
            { time: "18:00", category: "景點", emoji: "🏛", title: "凱旋門", map: "Arc de Triomphe Paris" }
          ]
        },
        {
          n: 4, date: "06.26", weekday: "週五", weather: "☀️", tempMin: 18, tempMax: 26, rain: 0,
          label: "凡爾賽宮 + 瑪黑區",
          stops: [
            { time: "09:30", category: "景點", emoji: "👑", title: "凡爾賽宮", map: "Palace of Versailles" },
            { time: "16:00", category: "景點", emoji: "🚶", title: "瑪黑區散步", note: "Le Marais", map: "Le Marais Paris" }
          ]
        },
        {
          n: 5, date: "06.27", weekday: "週六", weather: "⛅", tempMin: 17, tempMax: 25, rain: 15,
          label: "巴黎 → 阿姆斯特丹",
          tag: "移動日",
          stops: [
            { time: "10:00", category: "購物", emoji: "🛍", title: "老佛爺百貨", note: "Galeries Lafayette Haussmann", map: "Galeries Lafayette Haussmann Paris" },
            { time: "12:30", category: "景點", emoji: "🎭", title: "加尼葉歌劇院", note: "Palais Garnier", map: "Palais Garnier Paris" },
            { time: "14:00", category: "餐廳", emoji: "🍫", title: "PLAQ 巧克力!!!", map: "Plaq Chocolate Paris" },
            { time: "16:25", category: "交通", emoji: "🚄", title: "出發 → 阿姆斯特丹" }
          ]
        }
      ]
    },
    {
      id: "amsterdam",
      name: "阿姆斯特丹",
      en: "AMSTERDAM",
      dateRange: "2026-06-27 — 2026-06-30 · 4 天",
      weatherIcon: "⛅",
      hotel: { emoji: "🏨", name: "Ruby Emma", area: "Amsterdam" },
      days: [
        {
          n: 1, date: "06.27", weekday: "週六", weather: "⛅", tempMin: 15, tempMax: 22, rain: 25,
          label: "抵達阿姆斯特丹",
          stops: [
            { time: "晚間", category: "交通", emoji: "🚄", title: "抵達阿姆斯特丹", map: "Amsterdam Central Station" },
            { time: "21:00", category: "住宿", emoji: "🏨", title: "Ruby Emma Check-in", map: "Ruby Emma Hotel Amsterdam" }
          ]
        },
        {
          n: 2, date: "06.28", weekday: "週日", weather: "☀️", tempMin: 16, tempMax: 23, rain: 5,
          label: "風車起司日",
          tag: "Zaandam",
          stops: [
            { time: "10:00", category: "交通", emoji: "🚆", title: "Zaandam 桑斯安斯", map: "Zaanse Schans" },
            { time: "12:00", category: "景點", emoji: "🌬", title: "風車村", map: "Zaanse Schans Windmills" },
            { time: "14:00", category: "景點", emoji: "🧀", title: "起司工廠 Cheeseeeeee", map: "Cheese Farm Catharina Hoeve Zaanse Schans" }
          ]
        },
        {
          n: 3, date: "06.29", weekday: "週一", weather: "☀️", tempMin: 17, tempMax: 24, rain: 0,
          label: "羊角村一日遊",
          tag: "Giethoorn",
          stops: [
            { time: "全日", category: "景點", emoji: "🛶", title: "羊角村 Giethoorn", note: "水鄉、無車小鎮、運河船", map: "Giethoorn Netherlands" }
          ]
        },
        {
          n: 4, date: "06.30", weekday: "週二", weather: "⛅", tempMin: 16, tempMax: 22, rain: 20,
          label: "離開日 · 博物館區",
          tag: "離開日",
          stops: [
            { time: "10:00", category: "景點", emoji: "🏛", title: "Rijksmuseum", note: "國家博物館", map: "Rijksmuseum Amsterdam" },
            { time: "12:00", category: "餐廳", emoji: "🥪", title: "Albert Cuypmarket", note: "市集午餐", map: "Albert Cuyp Market Amsterdam" },
            { time: "13:00", category: "景點", emoji: "🌻", title: "梵谷博物館", note: "Van Gogh Museum", map: "Van Gogh Museum Amsterdam" },
            { time: "17:00", category: "住宿", emoji: "🏨", title: "Ruby Emma 退房", map: "Ruby Emma Hotel Amsterdam" },
            { time: "19:50", category: "交通", emoji: "✈️", title: "Schiphol 班機起飛", map: "Schiphol Airport Amsterdam" }
          ]
        }
      ]
    }
  ]
};

window.TRIP = TRIP;
window.mapUrl = (q) => q ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}` : null;
