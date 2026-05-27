// showcase-carousel.jsx — coded tab carousel showing 4 Tactician screens.
// Mounts into #carousel-root. Tabs at top, description on left, phone-shaped
// mockup on right. Each screen is hand-coded — no images, no screenshots.

(function () {
  const { useState } = React;

  // ─── Tabs metadata ─────────────────────────────────────────────────
  const tabs = [
    {
      num: '01',
      label: 'COMMAND',
      tagline: "Today's directive.",
      desc: "One screen. One directive. The engine reads your last seven days and writes today's workout against your actual load — not yesterday's intention.",
      rows: [
        { k: 'Directive', v: 'REDUCE' },
        { k: 'Triggers fired', v: '2' },
        { k: 'Auditable trace', v: 'Yes' },
      ],
    },
    {
      num: '02',
      label: 'DECISIONS',
      tagline: 'Decision history.',
      desc: 'Every directive Tactician fired in the last 28 days. Every rule. Every alternative considered. No black box.',
      rows: [
        { k: 'Window', v: '28 days' },
        { k: 'Trace per row', v: 'Full' },
        { k: 'Override log', v: 'Tracked' },
      ],
    },
    {
      num: '03',
      label: 'TRAJECTORY',
      tagline: 'Load curve.',
      desc: 'Acute vs chronic load across the cycle. Phase boundaries baked in. You see the ceiling. Tactician enforces it.',
      rows: [
        { k: 'Acute window', v: '7d' },
        { k: 'Chronic window', v: '28d' },
        { k: 'Phase anchors', v: 'Race date' },
      ],
    },
    {
      num: '04',
      label: 'SYSTEM',
      tagline: 'Engine status.',
      desc: 'Six metrics. Two thresholds. One timestamp. The engine shows its work — every evaluation, every time.',
      rows: [
        { k: 'Metrics tracked', v: '6 core' },
        { k: 'Thresholds', v: 'Deterministic' },
        { k: 'Re-evaluation', v: 'Per workout' },
      ],
    },
  ];

  // ─── SCREEN 01 — COMMAND ──────────────────────────────────────────
  function CommandScreenMock() {
    return (
      <div className="scr">
        <div className="scr-hdr">
          <span>Command · Today · Mon 19 May</span>
          <span className="live">Live</span>
        </div>
        <div className="scr-cmd-body">
          <div className="scr-cmd-eye">Action</div>
          <div className="scr-cmd-word">REDUCE</div>
          <div className="scr-cmd-workout">
            <span className="k">Long Run</span>
            <span className="v"><span className="strike">18mi</span>→ 12mi</span>
          </div>
          <div className="scr-cmd-flag">Load Ceiling Breach</div>
          <ul className="scr-cmd-fired">
            <li>Fired · Intensity Stack Protect</li>
            <li>Fired · ACR Ceiling Breach</li>
          </ul>
          <div className="scr-cmd-actions">
            <button>Why</button>
            <button>Modify</button>
            <button>Defer</button>
          </div>
        </div>
        <div className="scr-foot">
          <span>ACR 1.34 / 1.50</span>
          <span>WK 8 / 12</span>
        </div>
      </div>
    );
  }

  // ─── SCREEN 02 — DECISIONS ────────────────────────────────────────
  function DecisionsScreenMock() {
    const rows = [
      { date: 'Mon 19', badge: 'REDUCE',  tone: 'warn', name: 'Long run shortened to 12mi',     why: 'ACR 1.34 above ceiling' },
      { date: 'Sun 18', badge: 'PROCEED', tone: 'ok',   name: 'Recovery 6mi · Z1',              why: 'Load within band' },
      { date: 'Sat 17', badge: 'PUSH',    tone: 'ok',   name: 'Tempo 5×8min @ T',               why: 'Pace held in range' },
      { date: 'Fri 16', badge: 'REST',    tone: 'mute', name: 'No session',                     why: 'Planned rest day' },
      { date: 'Thu 15', badge: 'MODIFY',  tone: 'warn', name: 'Intervals → fartlek',            why: 'Intensity stacking' },
      { date: 'Wed 14', badge: 'PROCEED', tone: 'ok',   name: 'Easy 8mi · Z2',                  why: 'On track' },
    ];
    return (
      <div className="scr">
        <div className="scr-hdr">
          <span>Decisions · 7D</span>
          <span>6 entries</span>
        </div>
        <div className="scr-dec-list">
          {rows.map((r, i) => (
            <div key={i} className="scr-dec-row">
              <span className="date">{r.date}</span>
              <div className="body">
                <span className={`badge ${r.tone}`}>{r.badge}</span>
                <span className="name">{r.name}</span>
                <span className="why">{r.why}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="scr-foot">
          <span>Override log · 0</span>
          <span>Last sync · 06:14</span>
        </div>
      </div>
    );
  }

  // ─── SCREEN 03 — TRAJECTORY ───────────────────────────────────────
  function TrajectoryScreenMock() {
    return (
      <div className="scr">
        <div className="scr-hdr">
          <span>Trajectory · 28D</span>
          <span>Vienna HM · 42D</span>
        </div>
        <div className="scr-traj-body">
          <div className="scr-traj-phases">
            <div className="on"><i className="bar"></i><span>BASE</span></div>
            <div className="on"><i className="bar"></i><span>BUILD</span></div>
            <div><i className="bar"></i><span>PEAK</span></div>
            <div><i className="bar"></i><span>TAPER</span></div>
            <div><i className="bar"></i><span>RACE</span></div>
          </div>

          <div className="scr-traj-acr">
            <span className="v">1.34</span>
            <span className="u">ACR · Above</span>
          </div>
          <div className="scr-traj-meta">Acute 7d / Chronic 28d · Ceiling 1.50</div>

          <div className="scr-traj-chart">
            <svg viewBox="0 0 280 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="trajGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"  stopColor="#FFAA00" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#FFAA00" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* ceiling line */}
              <line x1="0" y1="40" x2="280" y2="40" stroke="#FFAA00" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" />
              <text x="4" y="34" fontFamily="JetBrains Mono" fontSize="8" fill="#FFAA00" letterSpacing="1">CEILING 1.50</text>

              {/* chronic — dashed */}
              <path d="M0 130 L28 122 L56 116 L84 110 L112 104 L140 96 L168 90 L196 84 L224 78 L252 72 L280 68"
                    fill="none" stroke="#A8A8A4" strokeWidth="1" strokeDasharray="3 3" />
              {/* acute — solid */}
              <path d="M0 138 L28 124 L56 118 L84 108 L112 88 L140 78 L168 70 L196 60 L224 54 L252 48 L280 44"
                    fill="none" stroke="#F3F3F2" strokeWidth="1.5" />
              <path d="M0 138 L28 124 L56 118 L84 108 L112 88 L140 78 L168 70 L196 60 L224 54 L252 48 L280 44 L280 180 L0 180 Z"
                    fill="url(#trajGrad)" />
              {/* current node */}
              <circle cx="280" cy="44" r="3.5" fill="#FFAA00" />
              <text x="232" y="58" fontFamily="JetBrains Mono" fontSize="8" fill="#FFAA00" letterSpacing="1">TODAY</text>
            </svg>
          </div>
          <div className="scr-traj-legend">
            <span><span className="swatch" style={{ background: '#F3F3F2' }}></span>Acute 7d</span>
            <span><span className="swatch" style={{ background: 'transparent', borderTop: '1.5px dashed #A8A8A4' }}></span>Chronic 28d</span>
          </div>
        </div>
        <div className="scr-foot">
          <span>Phase · Build</span>
          <span>42 days to race</span>
        </div>
      </div>
    );
  }

  // ─── SCREEN 04 — SYSTEM ───────────────────────────────────────────
  function SystemScreenMock() {
    const cells = [
      { k: 'Acute 7d',         v: '58.2',  unit: 'km', tone: 'warn' },
      { k: 'Chronic 28d',      v: '43.4',  unit: 'km' },
      { k: 'ACR',              v: '1.34',  unit: '',   tone: 'warn' },
      { k: 'Hard sessions',    v: '3 / 7', unit: '',   tone: 'hot' },
      { k: 'Days since rest',  v: '6',     unit: 'd',  tone: 'warn' },
      { k: 'Volume Δ',         v: '+18%',  unit: '',   tone: 'hot' },
    ];
    return (
      <div className="scr">
        <div className="scr-hdr">
          <span>System · Engine Status</span>
          <span>Deterministic</span>
        </div>
        <div className="scr-sys-body">
          <div className="scr-sys-grid">
            {cells.map((c, i) => (
              <div key={i} className="scr-sys-cell">
                <span className="k">{c.k}</span>
                <span className={`v ${c.tone || ''}`}>
                  {c.v}{c.unit && <span style={{ fontSize: 10, color: '#757570', marginLeft: 4, letterSpacing: '0.18em' }}>{c.unit}</span>}
                </span>
              </div>
            ))}
          </div>

          <div className="scr-sys-rules">
            <div className="head">2 rules fired · 19 May</div>
            <div className="scr-sys-rule">
              <span className="dot"></span>
              <span className="name">Intensity Stack Protect</span>
              <span className="meta">−1 hard</span>
            </div>
            <div className="scr-sys-rule">
              <span className="dot"></span>
              <span className="name">ACR Ceiling Breach</span>
              <span className="meta">−6mi</span>
            </div>
          </div>
        </div>
        <div className="scr-foot">
          <span>Last evaluated · Today 06:14</span>
          <span>v0.9.4</span>
        </div>
      </div>
    );
  }

  const screens = [CommandScreenMock, DecisionsScreenMock, TrajectoryScreenMock, SystemScreenMock];

  // ─── Carousel shell ───────────────────────────────────────────────
  function Carousel() {
    const [active, setActive] = useState(0);
    const Screen = screens[active];
    const tab = tabs[active];

    return (
      <div>
        <ul className="cx-tabs">
          {tabs.map((t, i) => (
            <button
              key={t.num}
              type="button"
              className={'cx-tab' + (i === active ? ' on' : '')}
              onClick={() => setActive(i)}
              aria-pressed={i === active}
            >
              <span className="num">{t.num}</span>
              <span className="lbl">{t.label}</span>
            </button>
          ))}
        </ul>

        <div className="cx-stage">
          <div className="cx-desc">
            <h4>{tab.tagline}</h4>
            <p>{tab.desc}</p>
            <ul>
              {tab.rows.map((r, i) => (
                <li key={i}><span>{r.k}</span><span className="v">{r.v}</span></li>
              ))}
            </ul>
          </div>

          <div className="cx-phone-wrap">
            <div className="cx-phone">
              <div className="cx-phone-inner">
                <Screen />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Boot — Babel transforms scripts async so DOMContentLoaded may have
  // already fired by the time we get here. Check readyState first.
  function boot() {
    const el = document.getElementById('carousel-root');
    if (!el) return;
    ReactDOM.createRoot(el).render(<Carousel />);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
