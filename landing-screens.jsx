// landing-screens.jsx — mounts iOS device frames + Tactician app screens
// into named slots in the landing page. Each slot has a scale class so the
// fixed-size (402×874) phone fits the surrounding layout.

(function () {
  const { useEffect, useState, useRef } = React;

  // ─── Compact analytics / history screen, built from existing atoms ──
  // Composes a third app screen for the product showcase rail.
  function AnalyticsScreen() {
    const days = [
      { d: 'MON', km: 8.2, type: 'EASY',     tone: 'ok' },
      { d: 'TUE', km: 0,   type: 'REST',     tone: 'dim' },
      { d: 'WED', km: 12.4, type: 'TEMPO',   tone: 'warn' },
      { d: 'THU', km: 6.5, type: 'EASY',     tone: 'ok' },
      { d: 'FRI', km: 0,   type: 'REST',     tone: 'dim' },
      { d: 'SAT', km: 24.0, type: 'LONG',    tone: 'ok' },
      { d: 'SUN', km: 5.0, type: 'RECOVERY', tone: 'ok' },
    ];
    const maxKm = 24;

    return (
      <div style={{ background: T.bgBase, minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
        <TopChrome screen="SYSTEM" sub="LOAD · 28D" acr="1.34" acrTone="warn" />

        <div style={{ flex: 1, overflow: 'auto', padding: '16px 16px 0' }}>
          {/* big metric */}
          <TactCard padding={18}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <StatusDot color={T.warn} size={6} />
              <MonoLabel size={10} color={T.warn} weight={600} tracking={0.2}>ACR · ABOVE CEILING</MonoLabel>
              <span style={{ flex: 1 }} />
              <MonoLabel size={9}>28D AVG</MonoLabel>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
              <span style={{ fontFamily: T.mono, fontSize: 52, fontWeight: 500, color: T.textPrimary, letterSpacing: '-0.02em', lineHeight: 1 }}>1.34</span>
              <span style={{ fontFamily: T.mono, fontSize: 13, color: T.warn, letterSpacing: '0.16em' }}>+0.18</span>
            </div>
            <div style={{ fontFamily: T.ui, fontSize: 13, color: T.textMuted, marginBottom: 16 }}>
              Acute load ratio. Ceiling 1.50.
            </div>

            {/* mini area chart */}
            <div style={{ height: 84, border: `1px solid ${T.border}`, background: T.bgInk, padding: 8, position: 'relative' }}>
              <svg viewBox="0 0 220 68" width="100%" height="100%" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F3F3F2" stopOpacity="0.18"/>
                    <stop offset="100%" stopColor="#F3F3F2" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                {/* ceiling line */}
                <line x1="0" y1="22" x2="220" y2="22" stroke={T.warn} strokeWidth="1" strokeDasharray="3 3" opacity="0.6"/>
                <path d="M0 50 L18 48 L36 46 L54 44 L72 38 L90 36 L108 32 L126 28 L144 26 L162 22 L180 18 L198 16 L220 14"
                      fill="none" stroke={T.textPrimary} strokeWidth="1.5"/>
                <path d="M0 50 L18 48 L36 46 L54 44 L72 38 L90 36 L108 32 L126 28 L144 26 L162 22 L180 18 L198 16 L220 14 L220 68 L0 68 Z"
                      fill="url(#g1)"/>
                <circle cx="220" cy="14" r="3" fill={T.warn}/>
              </svg>
              <span style={{ position: 'absolute', top: 4, right: 8, fontFamily: T.mono, fontSize: 8, color: T.warn, letterSpacing: '0.16em' }}>CEILING 1.50</span>
            </div>
          </TactCard>

          {/* WEEK shape histogram */}
          <SectionHead label="THIS WEEK · LOAD SHAPE" right="51.1 KM" />
          <div style={{ display: 'flex', gap: 8, padding: '12px 14px', border: `1px solid ${T.border}`, background: T.bgCard, alignItems: 'flex-end', height: 130 }}>
            {days.map(d => {
              const h = d.km === 0 ? 4 : Math.max(8, (d.km / maxKm) * 92);
              const c = d.tone === 'warn' ? T.warn : d.tone === 'dim' ? T.bgSubtle : T.textPrimary;
              return (
                <div key={d.d} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', width: '100%' }}>
                    <div style={{ width: '100%', height: h, background: c, opacity: d.tone === 'dim' ? 0.5 : 1 }} />
                  </div>
                  <MonoLabel size={8} color={T.textDim}>{d.d}</MonoLabel>
                </div>
              );
            })}
          </div>

          {/* split key/values */}
          <SectionHead label="ACTIVE CONSTRAINTS" right="2 SIGNALS" />
          <div style={{ border: `1px solid ${T.border}`, background: T.bgCard }}>
            <KVRow k="HARD / 7D"        v="2 / 3" warn />
            <KVRow k="ACR (7:28D)"      v="1.34" warn />
            <KVRow k="MONOTONY"         v="1.82" />
            <KVRow k="LONG RUN VOLUME"  v="24.0 KM" />
            <KVRow k="WEEKLY DELTA"     v="+8.2%" last />
          </div>

          <div style={{ height: 16 }} />
        </div>

        <BottomNav active="SYSTEM" />
      </div>
    );
  }

  // ─── Recommendations / decision-trace inline screen ─────────────────
  // A simpler "RECOMMENDATIONS" feed view, for the showcase rail.
  function RecommendScreen() {
    return (
      <div style={{ background: T.bgBase, minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
        <TopChrome screen="COMMAND" sub="DECISIONS · 7D" acr="1.34" acrTone="warn" />

        <div style={{ flex: 1, overflow: 'auto', padding: '16px 16px 0' }}>
          <SectionHead label="THIS WEEK'S DECISIONS" right="3 APPLIED" />

          {[
            { day: 'TUE 13', tone: 'warn', tag: 'ADJUSTED',  title: 'Recovery run replaces intervals',
              why: 'ACR 1.34 above ceiling. Intensity stacking flagged.', meta: 'WAS 8×800M · NOW Z1 40MIN' },
            { day: 'MON 12', tone: 'ok',   tag: 'EXECUTED',  title: 'Easy 8.2km',
              why: 'On track. Load within band.', meta: 'PACE 5:48/KM · HR 138' },
            { day: 'SUN 11', tone: 'warn', tag: 'REDUCED',   title: 'Long run shortened',
              why: 'Cumulative fatigue from prior block. Hold.', meta: 'PLAN 28KM · ACTUAL 22KM' },
            { day: 'SAT 10', tone: 'ok',   tag: 'EXECUTED',  title: 'Tempo 4×8min @ T',
              why: 'Pace held within range.', meta: 'AVG 4:42/KM · HR 168' },
          ].map((r, i) => {
            const c = r.tone === 'warn' ? T.warn : T.ok;
            return (
              <div key={i} style={{
                position: 'relative', display: 'flex', flexDirection: 'column', gap: 6,
                background: T.bgCard, border: `1px solid ${T.border}`,
                padding: '14px 14px 14px 22px', marginBottom: 8,
              }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: c }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MonoLabel size={9} color={c} weight={600} tracking={0.22}>{r.tag}</MonoLabel>
                  <span style={{ flex: 1 }} />
                  <MonoLabel size={9}>{r.day}</MonoLabel>
                </div>
                <div style={{ fontFamily: T.ui, fontSize: 14, fontWeight: 500, color: T.textPrimary }}>
                  {r.title}
                </div>
                <div style={{ fontFamily: T.ui, fontSize: 12, color: T.textMuted, lineHeight: 1.45 }}>
                  {r.why}
                </div>
                <div style={{ marginTop: 4 }}>
                  <MonoLabel size={9} color={T.textDim}>{r.meta}</MonoLabel>
                </div>
              </div>
            );
          })}

          <div style={{ height: 16 }} />
        </div>

        <BottomNav active="COMMAND" />
      </div>
    );
  }

  Object.assign(window, { AnalyticsScreen, RecommendScreen });

  // ─── Phone — wraps an iOS device at given scale ───────────────────
  // Outer box takes visual (scaled) size so layout flows correctly;
  // inner box renders the fixed-size iPhone and is scaled from top-left.
  function Phone({ children, scale = 1 }) {
    return (
      <div style={{ width: 402 * scale, height: 874 * scale, position: 'relative' }}>
        <div style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: 402, height: 874,
        }}>
          <IOSDevice dark>
            <div style={{ height: '100%', overflow: 'hidden' }}>{children}</div>
          </IOSDevice>
        </div>
      </div>
    );
  }

  // ─── Hero stack — 3 phones, staggered ──────────────────────────────
  function HeroStack() {
    const [hovered, setHovered] = useState(null);
    return (
      <div className="hero-phone-stack" onMouseLeave={() => setHovered(null)}>
        <div className="hero-phone back"
             onMouseEnter={() => setHovered('back')}
             style={hovered === 'back' ? { transform: 'rotate(-3deg) scale(0.86)', opacity: 0.75 } : {}}>
          <Phone scale={0.55}><AnalyticsScreen /></Phone>
        </div>
        <div className="hero-phone mid"
             onMouseEnter={() => setHovered('mid')}
             style={hovered === 'mid' ? { transform: 'rotate(0deg) scale(0.96)', opacity: 1 } : {}}>
          <Phone scale={0.6}><TrajectoryScreen /></Phone>
        </div>
        <div className="hero-phone front"
             onMouseEnter={() => setHovered('front')}
             style={hovered === 'front' ? { transform: 'rotate(0deg) scale(1.02)' } : {}}>
          <Phone scale={0.62}><CommandScreen onWhy={() => {}} /></Phone>
        </div>
      </div>
    );
  }

  // ─── How-it-works step phone — single, smaller ────────────────────
  function StepPhone({ which }) {
    let screen;
    if (which === 'command') screen = <CommandScreen onWhy={() => {}} />;
    else if (which === 'trajectory') screen = <TrajectoryScreen />;
    else screen = <AnalyticsScreen />;
    return <Phone scale={0.42}>{screen}</Phone>;
  }

  // ─── Showcase rail item ────────────────────────────────────────────
  function ShowcasePhone({ which }) {
    let screen;
    if (which === 'command') screen = <CommandScreen onWhy={() => {}} />;
    else if (which === 'trajectory') screen = <TrajectoryScreen />;
    else if (which === 'analytics') screen = <AnalyticsScreen />;
    else if (which === 'recommend') screen = <RecommendScreen />;
    else screen = <CommandScreen onWhy={() => {}} />;
    return <Phone scale={0.78}>{screen}</Phone>;
  }

  // ─── Boot — mount each phone into its slot ────────────────────────
  function mount(id, Component, props = {}) {
    const el = document.getElementById(id);
    if (!el) return;
    ReactDOM.createRoot(el).render(<Component {...props} />);
  }

  function boot() {
    // Hero, How-it-works steps, and product showcase are all hand-built
    // HTML blocks now. Nothing to mount from this file — kept for the
    // analytics/recommend definitions in case they're useful later.
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
