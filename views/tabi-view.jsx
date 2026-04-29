// TABI-style travel app view — single direction, mobile-first

const TabiApp = ({ trip }) => {
  const [activeCity, setActiveCity] = React.useState(trip.cities[0].id);
  const [activeDay, setActiveDay] = React.useState(1);
  const [view, setView] = React.useState("清單"); // 清單 / 時間軸 / 地圖

  const [notes, setNotes] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem("tabi_notes_v1") || "{}"); }
    catch { return {}; }
  });
  const setNote = (k, v) => {
    const next = { ...notes, [k]: v };
    setNotes(next);
    localStorage.setItem("tabi_notes_v1", JSON.stringify(next));
  };

  const city = trip.cities.find((c) => c.id === activeCity);
  const day = city.days.find((d) => d.n === activeDay) || city.days[0];

  React.useEffect(() => { setActiveDay(1); }, [activeCity]);

  return (
    <div style={S.shell}>
      {/* BRAND */}
      <div style={S.brandBar}>
        <span style={S.brandTop}>旅 ·</span>
        <span style={S.brandBot}>TABI</span>
        <span style={S.brandSub}>Travel Guide · by bb!</span>
      </div>

      {/* CITY TABS */}
      <div style={S.cityTabs}>
        {trip.cities.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCity(c.id)}
            style={{ ...S.cityTab, ...(activeCity === c.id ? S.cityTabActive : {}) }}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* CITY HEADER */}
      <div style={S.cityHeader}>
        <div style={S.cityKicker}>{city.en}</div>
        <h1 style={S.cityName}>{city.name}</h1>
        <div style={S.cityDates}>
          {city.dateRange} <span style={S.cloudIcon}>{city.weatherIcon}</span>
          <button style={S.adjustBtn}>調整日期</button>
        </div>
      </div>

      {/* VIEW SWITCH */}
      <div style={S.viewSwitch}>
        {[
          { id: "清單", emoji: "📋" },
          { id: "時間軸", emoji: "⏱" },
          { id: "地圖", emoji: "🗺" }
        ].map((v) => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            style={{ ...S.viewBtn, ...(view === v.id ? S.viewBtnActive : {}) }}
          >
            <span style={S.viewBtnEmoji}>{v.emoji}</span> {v.id}
          </button>
        ))}
      </div>

      {/* DAY CHIP STRIP */}
      <div style={S.dayStripWrap}>
        <div style={S.dayStrip}>
          {city.days.map((d) => {
            const active = d.n === activeDay;
            return (
              <button
                key={d.n}
                onClick={() => setActiveDay(d.n)}
                style={{ ...S.dayChip, ...(active ? S.dayChipActive : {}) }}
              >
                <div style={S.dayChipTop}>Day {d.n}</div>
                <div style={S.dayChipDate}>{d.date.replace(".", "/")} {d.weekday}</div>
                <div style={S.dayChipWx}>
                  <span>{d.weather}</span>
                  <span>{d.tempMin}–{d.tempMax}°C</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* DAY DETAIL HEADER */}
      <div style={S.dayDetail}>
        <div style={S.dayDetailLeft}>
          <div style={S.dayBig}>Day {day.n}</div>
          <div style={S.daySub}>{day.date.replace(".", "/")} {day.weekday}</div>
          <div style={S.dayWxRow}>
            <span style={S.dayWxIcon}>{day.weather}</span>
            <span style={S.dayWxKey}>有<br/>雨</span>
            <span style={S.dayWxTemp}>{day.tempMin}° –<br/>{day.tempMax}°C</span>
            <span style={S.dayWxRain}>💧 {day.rain}%</span>
          </div>
        </div>
        <div style={S.dayDetailRight}>
          <button style={S.actionPill}><span>🗺</span> 今日路線</button>
          <button style={{...S.actionPill, ...S.actionPillDark}}>＋ 新增項目</button>
        </div>
      </div>

      <div style={S.divider}>◆</div>

      {/* HOTEL PIN */}
      <div style={S.hotelPin}>
        <span style={S.hotelEmoji}>{city.hotel.emoji}</span>
        <span style={S.hotelName}>{city.hotel.name}</span>
        <span style={S.hotelHint}>(點擊修改)</span>
      </div>

      {/* STOPS */}
      <div style={S.stops}>
        {day.stops.map((stop, i) => (
          <React.Fragment key={i}>
            <article style={S.stopCard}>
              <div style={S.stopArrows}>
                <div style={S.stopArrow}>▲</div>
                <div style={S.stopArrow}>▼</div>
              </div>
              <div style={S.stopIconBox}>
                <div style={S.stopIconEmoji}>{stop.emoji}</div>
              </div>
              <div style={S.stopBody}>
                <div style={S.stopMetaRow}>
                  <span style={S.stopTime}>{stop.time}</span>
                  <span style={S.stopCategory}>{stop.category}</span>
                </div>
                <div style={S.stopTitle}>
                  {stop.map ? (
                    <a href={window.mapUrl(stop.map)} target="_blank" rel="noopener" style={S.stopLink}>
                      {stop.title}
                    </a>
                  ) : stop.title}
                </div>
                {stop.note && <div style={S.stopNote}>{stop.note}</div>}
                <div style={S.stopActions}>
                  <button style={S.stopActionBtn}>編輯</button>
                  <button style={S.stopActionBtn}>刪除</button>
                  <button style={S.stopActionBtn}>移至</button>
                </div>
              </div>
            </article>
            {i < day.stops.length - 1 && (
              <div style={S.transitConnector}>
                <span style={S.transitDot}>·</span>
                <button style={S.transitBtn}>🚇 查詢交通方式</button>
                <span style={S.transitDot}>·</span>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* NOTES */}
      <div style={S.notesCard}>
        <div style={S.notesHeader}>
          <span style={S.notesEmoji}>📝</span>
          <span>Day {day.n} 筆記</span>
        </div>
        <textarea
          value={notes[`${city.id}_${day.date}`] || ""}
          onChange={(e) => setNote(`${city.id}_${day.date}`, e.target.value)}
          placeholder="今日心得、好吃的、照片打卡..."
          style={S.notesInput}
        />
      </div>

      <div style={S.bottomSpacer} />
    </div>
  );
};

const ink = "#2a241d";
const cream = "#f5efe4";
const paper = "#fbf6ec";
const muted = "#8a7d6b";
const line = "rgba(42,36,29,0.15)";
const accent = "#6b8fb5";

const S = {
  shell: {
    fontFamily: "'Noto Sans TC', sans-serif",
    background: cream,
    color: ink,
    minHeight: "100%",
    maxWidth: 440,
    margin: "0 auto",
    padding: "22px 18px 60px",
    fontSize: 14
  },

  brandBar: { display: "flex", alignItems: "baseline", gap: 8, marginBottom: 22, paddingBottom: 14, borderBottom: `1px solid ${line}` },
  brandTop: { fontFamily: "'Noto Serif TC', serif", fontSize: 18, letterSpacing: "0.05em" },
  brandBot: { fontFamily: "'Noto Serif TC', serif", fontSize: 18, letterSpacing: "0.2em", fontWeight: 600 },
  brandSub: { fontSize: 11, color: muted, letterSpacing: "0.1em", marginLeft: "auto" },

  cityTabs: { display: "flex", gap: 6, marginBottom: 14 },
  cityTab: {
    padding: "6px 14px",
    background: "transparent",
    border: `1px solid ${line}`,
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: 13,
    color: muted,
    letterSpacing: "0.05em"
  },
  cityTabActive: { background: ink, color: cream, borderColor: ink, fontWeight: 600 },

  cityHeader: { marginBottom: 18 },
  cityKicker: { fontSize: 11, color: muted, letterSpacing: "0.4em", marginBottom: 4 },
  cityName: { fontSize: 38, fontFamily: "'Noto Serif TC', serif", fontWeight: 600, margin: 0, letterSpacing: "0.02em", lineHeight: 1.1 },
  cityDates: { fontSize: 12, color: muted, marginTop: 8, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.03em", display: "flex", alignItems: "center", gap: 8 },
  cloudIcon: { fontSize: 14 },
  adjustBtn: { background: "transparent", border: "none", color: accent, fontSize: 12, cursor: "pointer", padding: 0, fontFamily: "inherit", textDecoration: "underline", textUnderlineOffset: 3 },

  viewSwitch: { display: "flex", gap: 8, marginBottom: 18 },
  viewBtn: {
    padding: "8px 14px",
    background: paper,
    border: `1px solid ${line}`,
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: 13,
    color: muted,
    display: "flex",
    alignItems: "center",
    gap: 6
  },
  viewBtnActive: { background: ink, color: cream, borderColor: ink, fontWeight: 600 },
  viewBtnEmoji: { fontSize: 14 },

  dayStripWrap: { margin: "0 -18px 20px", overflow: "hidden" },
  dayStrip: { display: "flex", gap: 8, padding: "0 18px", overflowX: "auto", scrollSnapType: "x mandatory" },
  dayChip: {
    minWidth: 110,
    padding: "10px 12px",
    background: "transparent",
    border: "none",
    textAlign: "left",
    cursor: "pointer",
    fontFamily: "inherit",
    color: ink,
    scrollSnapAlign: "start"
  },
  dayChipActive: { background: ink, color: cream },
  dayChipTop: { fontSize: 14, fontWeight: 600, letterSpacing: "0.05em" },
  dayChipDate: { fontSize: 11, marginTop: 2, opacity: 0.85 },
  dayChipWx: { display: "flex", gap: 6, alignItems: "center", fontSize: 11, marginTop: 6, fontFamily: "'JetBrains Mono', monospace" },

  dayDetail: { display: "grid", gridTemplateColumns: "1fr auto", gap: 14, marginBottom: 8 },
  dayDetailLeft: {},
  dayBig: { fontSize: 28, fontFamily: "'Noto Serif TC', serif", fontWeight: 600, lineHeight: 1 },
  daySub: { fontSize: 12, color: muted, marginTop: 4, fontFamily: "'JetBrains Mono', monospace" },
  dayWxRow: { display: "flex", alignItems: "center", gap: 10, marginTop: 10, fontSize: 11, color: muted, fontFamily: "'JetBrains Mono', monospace" },
  dayWxIcon: { fontSize: 18 },
  dayWxKey: { fontSize: 10, lineHeight: 1.2, color: ink },
  dayWxTemp: { fontSize: 11, lineHeight: 1.2, color: ink },
  dayWxRain: { color: accent, display: "flex", alignItems: "center", gap: 2 },

  dayDetailRight: { display: "flex", flexDirection: "column", gap: 6, alignItems: "stretch" },
  actionPill: {
    background: paper,
    border: `1px solid ${line}`,
    padding: "7px 12px",
    fontSize: 12,
    cursor: "pointer",
    fontFamily: "inherit",
    color: ink,
    display: "flex",
    alignItems: "center",
    gap: 6,
    whiteSpace: "nowrap",
    justifyContent: "center"
  },
  actionPillDark: { background: ink, color: cream, borderColor: ink },

  divider: { textAlign: "center", color: muted, opacity: 0.4, margin: "16px 0", fontSize: 10 },

  hotelPin: { display: "flex", alignItems: "center", gap: 8, marginBottom: 14, fontSize: 13, paddingLeft: 4 },
  hotelEmoji: { fontSize: 18 },
  hotelName: { fontWeight: 500 },
  hotelHint: { color: muted, fontSize: 11, marginLeft: 4 },

  stops: { display: "flex", flexDirection: "column" },
  stopCard: {
    display: "grid",
    gridTemplateColumns: "20px 56px 1fr",
    gap: 10,
    padding: "14px 14px 12px",
    background: paper,
    border: `1px solid ${line}`,
    alignItems: "stretch"
  },
  stopArrows: { display: "flex", flexDirection: "column", justifyContent: "space-around", color: muted, fontSize: 9, opacity: 0.5 },
  stopArrow: { lineHeight: 1 },
  stopIconBox: {
    background: cream,
    border: `1px solid ${line}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: "1 / 1",
    alignSelf: "flex-start"
  },
  stopIconEmoji: { fontSize: 28 },
  stopBody: { minWidth: 0 },
  stopMetaRow: { display: "flex", alignItems: "baseline", gap: 10, marginBottom: 3 },
  stopTime: { fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, letterSpacing: "0.03em" },
  stopCategory: { fontSize: 11, color: muted, letterSpacing: "0.15em" },
  stopTitle: { fontSize: 15, fontWeight: 600, lineHeight: 1.4 },
  stopLink: { color: ink, textDecoration: "none", borderBottom: `1px solid ${line}` },
  stopNote: { fontSize: 12, color: muted, marginTop: 4, lineHeight: 1.5 },
  stopActions: { display: "flex", gap: 14, marginTop: 8, justifyContent: "flex-end" },
  stopActionBtn: { background: "transparent", border: "none", padding: 0, fontSize: 11, color: muted, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.05em" },

  transitConnector: { display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "10px 0" },
  transitDot: { color: muted, opacity: 0.4, fontFamily: "'JetBrains Mono', monospace" },
  transitBtn: {
    background: "transparent",
    border: "none",
    fontSize: 12,
    color: ink,
    cursor: "pointer",
    fontFamily: "inherit",
    display: "inline-flex",
    alignItems: "center",
    gap: 4
  },

  notesCard: {
    marginTop: 22,
    background: paper,
    border: `1px solid ${line}`,
    padding: 14
  },
  notesHeader: { display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, marginBottom: 10 },
  notesEmoji: { fontSize: 16 },
  notesInput: {
    width: "100%",
    minHeight: 80,
    background: "transparent",
    border: `1px solid ${line}`,
    padding: 10,
    fontFamily: "'Noto Sans TC', sans-serif",
    fontSize: 13,
    color: ink,
    resize: "vertical",
    outline: "none",
    lineHeight: 1.7
  },

  bottomSpacer: { height: 30 }
};

window.TabiApp = TabiApp;
