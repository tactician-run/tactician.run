// showcase-carousel.jsx — coded tab carousel of the app's current screens.
// Mounts into #carousel-root. Each screen is a web rebuild of the SwiftUI view it names
// (CommandView, TrajectoryView, WeekReviewView, TactSystemView), styled by console.css.
// One sample athlete runs through every screen and through the hero, so no number
// contradicts another: half marathon, goal 1:32:00, Sat 23 May, race Sun 14 Jun (T-22D),
// week 9 of 12, ACR 0.66 after a short week, so UNDERTRAINING proposes a longer long run.

(function () {
  const { useState, useRef, useEffect } = React;

  // ─── Tabs metadata ─────────────────────────────────────────────────
  const tabs = [
    {
      num: '01',
      label: 'COMMAND',
      tagline: "Today's directive.",
      desc: "One verb, the rationale behind it, and today's session, priced in distance, time and load. The engine proposes; the plan changes only when you slide to apply. Try it.",
      rows: [
        { k: 'Directives', v: 'Proceed · Modify · Reduce · Push · Rest' },
        { k: 'Commit', v: 'Slide to apply' },
        { k: 'Decline', v: 'Keep plan' },
      ],
    },
    {
      num: '02',
      label: 'TRAJECTORY',
      tagline: 'The block, on one spine.',
      desc: 'One time axis owns the screen. What you ran, the plan you are on now, and the plan as first built are three strokes, never recoloured. The verdict says whether the block has held or been rewritten. Every rewrite is a tick on the spine.',
      rows: [
        { k: 'Verdict', v: 'Intact · Diverged' },
        { k: 'Projection', v: 'Goal-race finish' },
        { k: 'Mutations', v: 'Logged, never silent' },
      ],
    },
    {
      num: '03',
      label: 'WEEK REVIEW',
      tagline: 'The week, graded.',
      desc: 'When the week closes it is graded against the plan you accepted. Four weighted categories, each with its own verdict, so the number visibly adds up. A missed session counts as zero, never as a blank. Then the week ahead, checked against the rules before it starts.',
      rows: [
        { k: 'Weights', v: 'Vol 40 · Long 20 · Quality 20 · Easy 20' },
        { k: 'Missed session', v: 'Counts 0' },
        { k: 'Cadence', v: 'Week · Phase · Race' },
      ],
    },
    {
      num: '04',
      label: 'SYSTEM',
      tagline: 'Engine status.',
      desc: 'The raw instruments, the inputs the engine is reading, and every rule in priority order with its threshold and live value. Nothing is hidden behind a score.',
      rows: [
        { k: 'Rules', v: '4 daily + ramp' },
        { k: 'Inputs', v: 'Plan · Strava' },
        { k: 'AI in decision path', v: 'None' },
      ],
    },
  ];

  // ─── Shared atoms ─────────────────────────────────────────────────
  // Each screen is a module, not a phone: the one region of the app view that carries
  // its idea, on a raised card. Status reads from the colored verdict text alone.
  const Head = ({ l, r, rc = '' }) => (
    <div className="tc-head"><span className="l">{l}</span>{r && <span className={'r ' + rc}>{r}</span>}</div>
  );
  const ModHead = ({ l, r }) => (
    <div className="tc-mod-head"><span className="l">{l}</span><span className="r">{r}</span></div>
  );
  const Foot = ({ children }) => <div className="tc-provenance">{children}</div>;

  // ─── MODULE 01 — COMMAND (the decision plane) ─────────────────────
  function CommandScreen() {
    const ref = useRef(null);
    useEffect(() => { if (window.tcBindConsole) window.tcBindConsole(ref.current); }, []);
    return (
      <div className="tc-module tc-console" data-state="proposed" ref={ref}>
        <div className="tc-strip">
          <span className="l">Directive<b data-when="proposed"> · Proposed</b><b data-when="applied"> · Adjusted</b></span>
          <span className="r" data-eval-clock>EVAL 06:12:04<span className="tplus"> · T+00:00:00</span></span>
        </div>
        <div className="tc-hero">
          <div className="tc-verb" data-when="proposed applied">PUSH</div>
          <div className="tc-verb" data-when="kept">PROCEED</div>
          <div className="tc-sub" data-when="proposed">Proposed: increase today’s stimulus.</div>
          <div className="tc-sub" data-when="applied">Applied: increase today’s stimulus.</div>
          <div className="tc-sub" data-when="kept">Proposal dismissed. Execute today as planned.</div>
          <div className="tc-rationale" data-when="proposed applied">
            <div className="lbl">RATIONALE</div>
            <p>Acute load at <span className="num">0.66×</span> chronic after a short week. Long run extended <span className="num">1.5 mi</span>, inside the <span className="num">15%</span> weekly ramp.</p>
          </div>
        </div>
        <div className="tc-session-row">
          <div>
            <div className="tc-session-title" data-when="proposed applied">Long run · <span className="num">12.5 mi</span></div>
            <div className="tc-session-title" data-when="kept">Long run · <span className="num">11.0 mi</span></div>
            <div className="tc-session-meta"><s data-when="proposed applied"><span className="num">11.0 mi</span></s><span data-when="proposed applied"> · </span><span className="num">8:20/mi</span> · Wk <span className="num">9/12</span></div>
          </div>
          <span className="tc-session-delta warn" data-when="proposed applied">+14 TSS</span>
          <span className="tc-session-delta" data-when="kept">Plan kept</span>
        </div>
        <div className="tc-commit">
          <div data-when="proposed applied">
            <div className="tc-slide" data-slide data-phase="idle">
              <span className="fill" aria-hidden="true"></span>
              <span className="track-lbl" data-track-lbl><span className="glyph" aria-hidden="true"></span><span className="txt">Slide to apply</span></span>
              <button type="button" className="tc-thumb" aria-label="Slide to apply the proposal. Press Enter to apply."><svg width="8" height="12" viewBox="0 0 8 12" aria-hidden="true"><path d="M2 1.5 6.5 6 2 10.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square"/></svg><svg className="check" width="12" height="10" viewBox="0 0 12 10" aria-hidden="true"><path d="M1.5 5.2 4.6 8.2 10.5 1.8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square"/></svg></button>
            </div>
          </div>
          <div data-when="proposed">
            <div className="tc-secondary">
              <button type="button" className="why" data-panel="why" aria-expanded="false">Why</button>
              <button type="button" className="adj" data-panel="adjust" aria-expanded="false">Adjust</button>
              <button type="button" className="def" data-keep>Keep plan</button>
            </div>
            <div className="tc-why-panel" data-panel-body="why" hidden>
              <div><span>Overload · ACR 0.66 ≤ 1.50</span><span className="pass">Pass</span></div>
              <div><span>Intensity stack · 1 hard / 7d</span><span className="pass">Pass</span></div>
              <div><span>Recovery · 1 day since rest</span><span className="pass">Pass</span></div>
              <div><span>Undertraining · ACR 0.66 &lt; 0.70</span><span className="fired">Fired</span></div>
            </div>
            <div className="tc-why-panel" data-panel-body="adjust" hidden>
              <div><span>Keep · 11.0 mi</span><span>ACR 0.68</span></div>
              <div><span>Proposed · 12.5 mi</span><span>ACR 0.71</span></div>
              <div><span>Longer · 13.2 mi</span><span className="pass">35% long-run cap</span></div>
              <div><span>Rest</span><span>ACR 0.61</span></div>
            </div>
          </div>
          <button type="button" className="tc-replay" data-replay data-when="applied kept">↺ Replay proposal</button>
        </div>
        <Foot>Deterministic engine v1.4 · No AI in decision path</Foot>
      </div>
    );
  }

  // ─── MODULE 02 — TRAJECTORY (spine + verdict) ─────────────────────
  // Spine geometry in the app's own 393×132 coordinate space. 12 weeks across x 8→385.
  const wx = w => 8 + (w - 1) * (377 / 11);
  const executed = [[1, 86], [2, 80], [3, 74], [4, 84], [5, 70], [6, 64], [7, 76], [8, 70], [9, 66]];
  const imported = [[1, 86], [2, 80], [3, 74], [4, 82], [5, 68], [6, 60], [7, 52], [8, 62], [9, 46], [10, 40], [11, 58], [12, 78]];
  const current  = [[9, 66], [10, 56], [11, 66], [12, 80]];
  const pts = a => a.map(([w, y]) => `${wx(w).toFixed(1)} ${y}`).join(' L');
  const bandPath = () => 'M' + pts(imported.filter(([w]) => w >= 9)) + ' L' + pts([...current].reverse()) + ' Z';

  function TrajectoryScreen() {
    return (
      <div className="tc-module">
        <ModHead l="Trajectory · Block 12W" r="Wk 9/12 · T-22D" />
        <div className="tc-spine">
          <div className="tc-phases">
            <div className="done" style={{ flex: 4 }}><i></i><span>BASE</span></div>
            <div className="cur" style={{ flex: 5, '--p': '80%' }}><i></i><span>BUILD</span></div>
            <div style={{ flex: 1.4 }}><i></i><span>PEAK</span></div>
            <div style={{ flex: 1.4 }}><i></i><span>TAPER</span></div>
          </div>
          <svg viewBox="0 0 393 132" aria-label="Load spine: executed, current plan and plan as imported">
            <defs>
              <linearGradient id="tcExecGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" style={{ stopColor: 'var(--text-primary)', stopOpacity: 0.16 }} />
                <stop offset="100%" style={{ stopColor: 'var(--text-primary)', stopOpacity: 0 }} />
              </linearGradient>
            </defs>
            <line x1="0" y1="108" x2="393" y2="108" style={{ stroke: 'var(--border)' }} strokeWidth="1" />
            <path d={'M' + pts(executed) + ` L${wx(9).toFixed(1)} 108 L${wx(1).toFixed(1)} 108 Z`} fill="url(#tcExecGrad)" />
            <path d={bandPath()} style={{ fill: 'var(--status-at-risk)', fillOpacity: 0.1 }} />
            <path d={'M' + pts(imported)} fill="none" style={{ stroke: 'var(--text-ghost)' }} strokeWidth="1" strokeDasharray="3 3" />
            <path d={'M' + pts(current)} fill="none" style={{ stroke: 'var(--status-at-risk)' }} strokeWidth="1.25" />
            <path d={'M' + pts(executed)} fill="none" style={{ stroke: 'var(--text-primary)' }} strokeWidth="1.6" strokeLinejoin="round" />
            {[7, 8].map(w => <rect key={w} x={wx(w) - 0.75} y="112" width="1.5" height="7" style={{ fill: 'var(--status-at-risk)' }} />)}
            <line x1={wx(9)} y1="8" x2={wx(9)} y2="126" style={{ stroke: 'var(--text-primary)' }} strokeWidth="1" />
            <circle cx={wx(9)} cy="66" r="2.8" style={{ fill: 'var(--text-primary)' }} />
            <line x1="385" y1="8" x2="385" y2="126" style={{ stroke: 'var(--text-dim)' }} strokeWidth="1" strokeDasharray="2 3" />
            <rect x="381.5" y="76.5" width="7" height="7" style={{ fill: 'var(--status-at-risk)' }} />
          </svg>
          <div className="tc-legend">
            <span><i className="ex"></i>EXECUTED</span>
            <span><i className="cp"></i>CURRENT PLAN</span>
            <span><i className="im"></i>AS IMPORTED</span>
            <span><i className="mu"></i>MUTATION</span>
          </div>
        </div>
        <div className="tc-verdict">
          <div className="word">DIVERGED</div>
          <div className="line">Weeks 7–8 re-anchored on executed volume. Taper and race week untouched.</div>
        </div>
        <div className="tc-thirds verdict-triple">
          <div><span className="k">Plan drift</span><span className="v warn">−6.2%</span></div>
          <div><span className="k">Projected</span><span className="v">1:33:40</span></div>
          <div><span className="k">ACR</span><span className="v warn">0.66</span></div>
        </div>
        <Foot>2 mutations · Ramp ceiling · Every one logged</Foot>
      </div>
    );
  }

  // ─── MODULE 03 — WEEK REVIEW (verdict + categories) ───────────────
  function ReviewScreen() {
    return (
      <div className="tc-module">
        <ModHead l="Week review · Week 8" r="11–17 May" />
        <div className="tc-verdict" style={{ paddingTop: 18 }}>
          <div className="word">SLIGHTLY UNDER</div>
          <div className="line">Wednesday’s intervals cut short. Long run and easy days held.</div>
        </div>
        <div className="tc-region tc-cats-wrap">
          <Head l="Categories" r="85% weighted" rc="warn" />
          <div className="tc-cats">
            <div><span className="n">Volume<small>×0.4</small></span><span className="p">86%</span><span className="w warn">SLIGHTLY UNDER</span></div>
            <div><span className="n">Long run<small>×0.2</small></span><span className="p">100%</span><span className="w ok">ON TARGET</span></div>
            <div><span className="n">Quality<small>×0.2</small></span><span className="p">60%</span><span className="w warn">UNDER TARGET</span></div>
            <div><span className="n">Easy runs<small>×0.2</small></span><span className="p">94%</span><span className="w ok">ON TARGET</span></div>
          </div>
        </div>
        <Foot>Week ahead · Week 9 · Clear on all rules</Foot>
      </div>
    );
  }

  // ─── MODULE 04 — SYSTEM (gauge + rules) ───────────────────────────
  function SystemScreen() {
    const rules = [
      { n: 'Overload protection', t: 'ACR ≤ 1.50', c: '0.66' },
      { n: 'Intensity stack', t: '≤ 3 hard / 7d', c: '1' },
      { n: 'Recovery enforcement', t: 'Rest ≤ 6d', c: '1d' },
      { n: 'Undertraining push', t: 'ACR ≥ 0.70', c: '0.66', fired: true },
      { n: 'Default proceed', t: 'Fallback', c: '--' },
    ];
    return (
      <div className="tc-module">
        <ModHead l="System · Engine status" r="Live" />
        <div className="tc-gauge" style={{ paddingTop: 16 }}>
          <div className="row"><span className="v">0.66</span><span className="band">ACR · BAND 0.80–1.30</span></div>
          <div className="bar" aria-hidden="true">
            <span className="ok-band" style={{ left: '40%', width: '25%' }}></span>
            <span className="mark" style={{ left: '33%' }}></span>
          </div>
          <div className="scale"><span>0.00</span><span>1.00</span><span>2.00</span></div>
        </div>
        <div className="tc-region" style={{ borderTop: '1px solid var(--border-soft)' }}>
          <Head l="Decision rules" r="Priority order" />
          <div className="tc-kv">
            {rules.map((r, i) => (
              <div key={i}>
                <span style={{ color: r.fired ? 'var(--text-primary)' : undefined }}>0{i + 1} · {r.n}</span>
                <span className={'v' + (r.fired ? ' warn' : '')}>{r.fired ? 'FIRED · ' : ''}{r.c} · TGT {r.t}</span>
              </div>
            ))}
          </div>
        </div>
        <Foot>Same inputs, same output · No AI</Foot>
      </div>
    );
  }

  const screens = [CommandScreen, TrajectoryScreen, ReviewScreen, SystemScreen];

  // ─── Carousel shell — WAI-ARIA tabs ───────────────────────────────
  function Carousel() {
    const [active, setActive] = useState(0);
    const tabRefs = useRef([]);
    const Screen = screens[active];
    const tab = tabs[active];

    const onKey = (ev) => {
      let next = null;
      if (ev.key === 'ArrowRight') next = (active + 1) % tabs.length;
      else if (ev.key === 'ArrowLeft') next = (active - 1 + tabs.length) % tabs.length;
      else if (ev.key === 'Home') next = 0;
      else if (ev.key === 'End') next = tabs.length - 1;
      if (next === null) return;
      ev.preventDefault();
      setActive(next);
      tabRefs.current[next] && tabRefs.current[next].focus();
    };

    return (
      <div>
        <div className="cx-tabs" role="tablist" aria-label="Tactician screens" onKeyDown={onKey}>
          {tabs.map((t, i) => (
            <button
              key={t.num}
              ref={el => (tabRefs.current[i] = el)}
              type="button"
              role="tab"
              id={'cx-tab-' + i}
              aria-selected={i === active}
              aria-controls="cx-panel"
              tabIndex={i === active ? 0 : -1}
              className={'cx-tab' + (i === active ? ' on' : '')}
              onClick={() => setActive(i)}
            >
              <span className="num">{t.num}</span>
              <span className="lbl">{t.label}</span>
            </button>
          ))}
        </div>

        <div className="cx-stage" role="tabpanel" id="cx-panel" aria-labelledby={'cx-tab-' + active}>
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
            <div className="cx-module-slot" key={active}>
              <Screen />
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
