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
      desc: "One screen. One directive. The engine reads your last seven days and writes today's workout against your actual load. Not yesterday's intention.",
      rows: [
        { k: 'Directive', v: 'PUSH' },
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
      desc: 'Acute vs chronic load across the cycle. Phase boundaries baked in. You see the limits. Tactician enforces them.',
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
      desc: 'Six metrics. Two thresholds. One timestamp. The engine shows its work. Every evaluation, every time.',
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
          <div className="scr-cmd-word">PUSH</div>
          <div className="scr-cmd-workout">
            <span className="k">Long Run</span>
            <span className="v"><span className="strike">14mi</span>→ 18mi</span>
          </div>
          <div className="scr-cmd-flag">Load Headroom Open</div>
          <ul className="scr-cmd-fired">
            <li>Fired · Intensity Headroom Clear</li>
            <li>Fired · Build Window Active</li>
          </ul>
          <div className="scr-cmd-actions">
            <button>Why</button>
            <button>Modify</button>
            <button>Defer</button>
          </div>
        </div>
        <div className="scr-foot">
          <span>ACR 0.78 / 0.80</span>
          <span>WK 8 / 12</span>
        </div>
      </div>
    );
  }

  // ─── SCREEN 02 — DECISIONS ────────────────────────────────────────
  function DecisionsScreenMock() {
    const rows = [
      { date: 'Mon 19', badge: 'PUSH',    tone: 'ok',   name: 'Long run extended to 18mi',       why: 'ACR 0.78 below floor' },
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
          <span>Vienna HM · 28D</span>
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
            <span className="v">0.78</span>
            <span className="u">ACR · Below</span>
          </div>
          <div className="scr-traj-meta">Acute 7d / Chronic 28d · Floor 0.80</div>

          <div className="scr-traj-chart">
            <svg viewBox="0 0 280 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="trajGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"  stopColor="#12A12A" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#12A12A" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* floor line */}
              <line x1="0" y1="120" x2="280" y2="120" stroke="#FFAA00" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" />
              <text x="4" y="114" fontFamily="JetBrains Mono" fontSize="8" fill="#FFAA00" letterSpacing="1">FLOOR 0.80</text>

              {/* chronic — dashed */}
              <path d="M0 96 L28 97 L56 98 L84 99 L112 100 L140 100 L168 101 L196 102 L224 103 L252 104 L280 104"
                    fill="none" stroke="#A8A8A4" strokeWidth="1" strokeDasharray="3 3" />
              {/* acute — solid */}
              <path d="M0 100 L28 104 L56 108 L84 112 L112 116 L140 122 L168 128 L196 134 L224 140 L252 146 L280 150"
                    fill="none" stroke="var(--text-primary)" strokeWidth="1.5" />
              <path d="M0 100 L28 104 L56 108 L84 112 L112 116 L140 122 L168 128 L196 134 L224 140 L252 146 L280 150 L280 180 L0 180 Z"
                    fill="url(#trajGrad)" />
              {/* current node */}
              <circle cx="280" cy="150" r="3.5" fill="#12A12A" />
              <text x="232" y="146" fontFamily="JetBrains Mono" fontSize="8" fill="#12A12A" letterSpacing="1">TODAY</text>
            </svg>
          </div>
          <div className="scr-traj-legend">
            <span><span className="swatch" style={{ background: 'var(--text-primary)' }}></span>Acute 7d</span>
            <span><span className="swatch" style={{ background: 'transparent', borderTop: '1.5px dashed var(--text-muted)' }}></span>Chronic 28d</span>
          </div>
        </div>
        <div className="scr-foot">
          <span>Phase · Build</span>
          <span>28 days to race</span>
        </div>
      </div>
    );
  }

  // ─── SCREEN 04 — SYSTEM ───────────────────────────────────────────
  function SystemScreenMock() {
    const cells = [
      { k: 'Acute 7d',         v: '33.9',  unit: 'km' },
      { k: 'Chronic 28d',      v: '43.4',  unit: 'km' },
      { k: 'ACR',              v: '0.78',  unit: '' },
      { k: 'Hard sessions',    v: '1 / 7', unit: '' },
      { k: 'Days since rest',  v: '2',     unit: 'd' },
      { k: 'Volume Δ',         v: '−16%',  unit: '' },
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
                  {c.v}{c.unit && <span style={{ fontSize: 10, color: 'var(--text-dim)', marginLeft: 4, letterSpacing: '0.18em' }}>{c.unit}</span>}
                </span>
              </div>
            ))}
          </div>

          <div className="scr-sys-rules">
            <div className="head">2 rules fired · 19 May</div>
            <div className="scr-sys-rule">
              <span className="dot"></span>
              <span className="name">Intensity Headroom Clear</span>
              <span className="meta">+1 quality</span>
            </div>
            <div className="scr-sys-rule">
              <span className="dot"></span>
              <span className="name">Build Window Active</span>
              <span className="meta">+4mi</span>
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
