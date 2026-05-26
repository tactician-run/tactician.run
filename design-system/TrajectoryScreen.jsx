// TrajectoryScreen — recreates Tactician/Views/Trajectory/TrajectoryView.swift
// PhaseBar + sticky pills (HISTORY / NOW / PROJECTION) + load curve + system cards.

function TrajectoryScreen() {
  const [active, setActive] = React.useState('NOW');
  return (
    <div style={{ background: T.bgBase, minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <TopChrome screen="TRAJECTORY" sub="VIENNA HM" acr="1.34" acrTone="warn" />
      <PhaseBar />
      <StickyPills active={active} onSelect={setActive} />

      <div style={{ flex: 1, overflow: 'auto' }}>
        {active === 'HISTORY' && <HistoryBlock />}
        {active === 'NOW' && <NowBlock />}
        {active === 'PROJECTION' && <ProjectionBlock />}
        <div style={{ height: 16 }} />
      </div>

      <BottomNav active="TRAJECTORY" />
    </div>
  );
}

function PhaseBar() {
  const phases = [
    { label: 'BASE',  weeks: 4, state: 'done' },
    { label: 'BUILD', weeks: 4, state: 'current', progress: 0.5 },
    { label: 'PEAK',  weeks: 2, state: 'future' },
    { label: 'TAPER', weeks: 1, state: 'future' },
    { label: 'RACE',  weeks: 0, state: 'race' },
  ];
  return (
    <div style={{
      display: 'flex', gap: 4, padding: '6px 18px 6px',
      borderBottom: `1px solid ${T.borderSoft}`,
    }}>
      {phases.map(p => {
        const isRace = p.state === 'race';
        const flex = isRace ? '0 0 40px' : p.weeks;
        const railBg = p.state === 'done' ? T.textPrimary
                     : p.state === 'current' ? T.bgSubtle : T.bgElevated;
        const labelColor = p.state === 'current' ? T.textPrimary
                         : p.state === 'done' ? T.textMuted : T.textGhost;
        return (
          <div key={p.label} style={{ flex, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ height: 3, background: railBg, position: 'relative' }}>
              {p.state === 'current' && (
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0,
                  width: `${p.progress * 100}%`, background: T.textPrimary,
                }} />
              )}
            </div>
            <span style={{
              fontFamily: T.mono, fontSize: 9, fontWeight: 500, letterSpacing: '0.12em',
              color: labelColor,
            }}>{p.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function StickyPills({ active, onSelect }) {
  const sections = ['HISTORY', 'NOW', 'PROJECTION'];
  return (
    <div style={{
      display: 'flex', gap: 6, padding: '6px 16px',
      background: T.bgBase, borderBottom: `1px solid ${T.border}`,
    }}>
      {sections.map(s => {
        const on = s === active;
        return (
          <button key={s} onClick={() => onSelect(s)} style={{
            height: 28, padding: '0 14px', cursor: 'pointer',
            background: on ? T.bgActive : 'transparent',
            color: on ? T.textOnActive : T.textMuted,
            border: on ? 'none' : `1px solid ${T.border}`,
            borderRadius: 9999,
            fontFamily: T.ui, fontSize: 11, fontWeight: 500,
            letterSpacing: '0.18em', textTransform: 'uppercase',
          }}>{s}</button>
        );
      })}
    </div>
  );
}

// ── HISTORY ───────────────────────────────────────────────────────────────

function HistoryBlock() {
  return (
    <div style={{ padding: '0 16px' }}>
      <TimelineMark tone="past" label="HISTORY" sub="28D WINDOW" />
      <SectionHead label="LOAD CURVE" right="28D" />
      <LoadCurveChart />
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0' }}>
        <KVMetric label="ACUTE 7D" value="42.0" unit="TSS" />
        <KVMetric label="CHRONIC 28D" value="35.6" unit="TSS" />
        <KVMetric label="RATIO" value="1.34" tone="warn" />
      </div>
      <SectionHead label="EXECUTION LOG" />
      <ExecutionLog />
    </div>
  );
}

function TimelineMark({ tone, label, sub }) {
  const c = tone === 'past' ? T.textDim : tone === 'now' ? T.textPrimary : T.textMuted;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '20px 0 14px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ position: 'relative', width: 14, height: 14, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          {tone === 'now' && (
            <span style={{ position: 'absolute', inset: 0, border: `1px solid ${T.textPrimary}`, borderRadius: 999 }} />
          )}
          <span style={{ width: 8, height: 8, background: c, borderRadius: 999 }} />
        </span>
        <MonoLabel size={10} color={c} weight={700} tracking={0.24}>{label}</MonoLabel>
      </div>
      <div style={{ flex: 1, height: 1, background: T.border }} />
      <MonoLabel size={9} color={T.textGhost}>{sub}</MonoLabel>
    </div>
  );
}

function LoadCurveChart() {
  // 28 daily points. Acute (solid) climbs faster than chronic (dashed).
  const acute = [22,26,24,28,30,28,32,30,34,36,32,38,40,36,42,44,38,46,44,40,46,48,44,50,52,46,54,42];
  const chronic = [28,28,28,29,30,30,31,31,32,32,33,33,34,34,34,34,35,35,35,35,36,36,36,36,36,36,35,36];
  const W = 320, H = 84, pad = 4;
  const min = Math.min(...acute, ...chronic) - 6;
  const max = Math.max(...acute, ...chronic) + 8;
  const x = i => pad + (W - 2 * pad) * i / (acute.length - 1);
  const y = v => pad + (H - 2 * pad) * (1 - (v - min) / (max - min));
  const polyAcute = acute.map((v, i) => `${x(i)},${y(v)}`).join(' ');
  const polyChronic = chronic.map((v, i) => `${x(i)},${y(v)}`).join(' ');
  const areaPath = `M ${x(0)},${y(acute[0])} ${acute.slice(1).map((v,i) => `L ${x(i+1)},${y(v)}`).join(' ')} L ${x(acute.length-1)},${H-pad} L ${x(0)},${H-pad} Z`;
  const lastX = x(acute.length - 1);
  const lastY = y(acute[acute.length - 1]);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: H }}>
      <defs>
        <linearGradient id="acuteFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={T.textPrimary} stopOpacity="0.22" />
          <stop offset="100%" stopColor={T.textPrimary} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#acuteFill)" />
      <polyline fill="none" stroke={T.textPrimary} strokeWidth="1.5" points={polyAcute} />
      <polyline fill="none" stroke={T.textDim} strokeWidth="1" strokeDasharray="4 3" points={polyChronic} />
      <circle cx={lastX} cy={lastY} r="2.5" fill={T.textPrimary} />
    </svg>
  );
}

function ExecutionLog() {
  const bars = [
    'ok','ok','warn','ok','dim','ok','ok',
    'warn','ok','ok','ok','dim','warn','ok',
    'ok','warn','ok','ok','dim','ok','ok',
  ];
  const color = s => s === 'ok' ? T.ok : s === 'warn' ? T.warn : T.textDim;
  return (
    <TactCard>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <MonoLabel size={9}>18 / 21 · 86% COMPLIANCE</MonoLabel>
        <MonoLabel size={9} color={T.textDim}>EXPAND</MonoLabel>
      </div>
      <div style={{ display: 'flex', gap: 2 }}>
        {bars.map((s, i) => (
          <div key={i} style={{ flex: 1, height: 4, background: color(s) }} />
        ))}
      </div>
    </TactCard>
  );
}

// ── NOW ───────────────────────────────────────────────────────────────────

function NowBlock() {
  return (
    <div style={{ background: T.bgInk, padding: '0 16px 20px' }}>
      <TimelineMark tone="now" label="NOW" sub="SYSTEM STATE" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <SystemConditionCard />
        <SystemConfidenceCard />
        <ActiveConstraintsCard />
        <PhaseContextCard />
      </div>
    </div>
  );
}

function SystemConditionCard() {
  return (
    <TactCard padding={14}>
      <div style={{ height: 2, background: T.warn, margin: '-14px -14px 14px' }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <MonoLabel size={10} color={T.warn} weight={700} tracking={0.22}>SYSTEM CONDITION</MonoLabel>
          <div>
            <div style={{ fontFamily: T.ui, fontSize: 26, fontWeight: 600, color: T.textPrimary, letterSpacing: '-0.02em' }}>Load elevated.</div>
            <div style={{ fontFamily: T.ui, fontSize: 26, fontWeight: 600, color: T.textMuted, letterSpacing: '-0.02em' }}>Intensity capped.</div>
          </div>
        </div>
        <StatusDot color={T.warn} size={10} pulse />
      </div>
      {/* 3-axis strip */}
      <div style={{ display: 'flex', border: `1px solid ${T.border}`, marginTop: 16 }}>
        <Axis label="LOAD" value="ELEVATED" tone="warn" />
        <div style={{ width: 1, background: T.border }} />
        <Axis label="INTENSITY" value="CAPPED" tone="warn" />
        <div style={{ width: 1, background: T.border }} />
        <Axis label="STATUS" value="RECOVERING" />
      </div>
      {/* numerics footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
        <MicroMetric label="ACUTE" value="42.0" unit="TSS" />
        <MicroMetric label="CHRONIC" value="35.6" unit="TSS" />
        <MicroMetric label="ACR" value="1.34" tone="warn" />
        <MicroMetric label="DAYS REST" value="5" unit="D" />
      </div>
    </TactCard>
  );
}

function Axis({ label, value, tone = 'default' }) {
  const c = toneColor(tone);
  return (
    <div style={{
      flex: 1, padding: '8px 0',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
    }}>
      <MonoLabel size={9} color={T.textGhost}>{label}</MonoLabel>
      <MonoLabel size={10} color={c} weight={700} tracking={0.14}>{value}</MonoLabel>
    </div>
  );
}

function MicroMetric({ label, value, unit = '', tone = 'default' }) {
  const c = toneColor(tone);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <MonoLabel size={8} color={T.textGhost}>{label}</MonoLabel>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
        <span style={{ fontFamily: T.mono, fontSize: 12, fontWeight: 500, color: c }}>{value}</span>
        {unit && <MonoLabel size={8} color={T.textGhost}>{unit}</MonoLabel>}
      </div>
    </div>
  );
}

function SystemConfidenceCard() {
  const level = 4;
  return (
    <TactCard>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <MonoLabel size={10} color={T.textPrimary} weight={600} tracking={0.22}>SYSTEM CONFIDENCE</MonoLabel>
        <MonoLabel size={10} color={T.ok} weight={700} tracking={0.14}>HIGH</MonoLabel>
      </div>
      <div style={{ display: 'flex', gap: 3, margin: '12px 0' }}>
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{ flex: 1, height: 4, background: i < level ? T.ok : T.bgElevated }} />
        ))}
      </div>
      <div style={{ border: `1px solid ${T.border}` }}>
        <KVRow k="ADHERENCE" v="86%" />
        <KVRow k="WORKOUTS 28D" v="18" />
        <KVRow k="HARD 7D" v="2" warn last />
      </div>
    </TactCard>
  );
}

function ActiveConstraintsCard() {
  const flags = [
    { label: 'Acute:chronic ratio above threshold', code: 'ACR-CEILING' },
    { label: 'Hard session frequency exceeded', code: 'INTENSITY-STACK' },
  ];
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <MonoLabel size={10} color={T.textPrimary} weight={600} tracking={0.22}>ACTIVE CONSTRAINTS</MonoLabel>
        <MonoLabel size={9} color={T.warn}>2 ENFORCED</MonoLabel>
      </div>
      <div style={{ border: `1px solid ${T.border}` }}>
        {flags.map((f, i) => (
          <div key={f.code} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px',
            borderBottom: i === flags.length - 1 ? 'none' : `1px solid ${T.border}`,
          }}>
            <StatusDot color={T.warn} size={6} />
            <div style={{ flex: 1, fontFamily: T.ui, fontSize: 12, fontWeight: 500, color: T.textSecondary }}>{f.label}</div>
            <MonoLabel size={8} color={T.textGhost}>{f.code}</MonoLabel>
          </div>
        ))}
      </div>
    </div>
  );
}

function PhaseContextCard() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <MonoLabel size={10} color={T.textPrimary} weight={600} tracking={0.22}>PHASE · BUILD</MonoLabel>
        <MonoLabel size={9}>WK 8 / 12 · 67%</MonoLabel>
      </div>
      <TactCard>
        <div style={{ fontFamily: T.ui, fontSize: 18, fontWeight: 600, color: T.textPrimary, marginBottom: 12 }}>
          Raise threshold ceiling.
        </div>
        <div style={{ display: 'flex', background: T.bgInk }}>
          <div style={{ width: 2, background: T.ok }} />
          <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <MonoLabel size={9} color={T.ok} weight={600} tracking={0.16}>OBJECTIVE</MonoLabel>
            <div style={{ fontFamily: T.ui, fontSize: 12, color: T.textSecondary, lineHeight: 1.4 }}>
              Progressive intensity introduction. Monitor ACR closely.
            </div>
          </div>
        </div>
      </TactCard>
    </div>
  );
}

// ── PROJECTION ────────────────────────────────────────────────────────────

function ProjectionBlock() {
  return (
    <div style={{ padding: '0 16px' }}>
      <TimelineMark tone="future" label="PROJECTION" sub="UPCOMING" />
      <WeekShapeCard />
      <UpcomingProjection />
    </div>
  );
}

function WeekShapeCard() {
  const days = [
    { day: 'MON', date: '12', load: 0.55, style: 'completed' },
    { day: 'TUE', date: '13', load: 0.30, style: 'modified', today: true },
    { day: 'WED', date: '14', load: 0.40, style: 'easy' },
    { day: 'THU', date: '15', load: 0.85, style: 'hard' },
    { day: 'FRI', date: '16', load: 0.35, style: 'easy' },
    { day: 'SAT', date: '17', load: 1.00, style: 'hard' },
    { day: 'SUN', date: '18', load: 0.10, style: 'rest' },
  ];
  const styleColor = s => ({
    completed: T.ok, modified: T.warn, hard: T.textPrimary,
    easy: T.bgSubtle, rest: T.bgElevated,
  })[s] || T.bgElevated;
  const barH = 110;
  return (
    <TactCard>
      <SectionHead label="WEEK SHAPE" />
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: barH + 20 }}>
        {days.map(d => (
          <div key={d.day} style={{ flex: 1, display: 'flex', alignItems: 'flex-end', height: '100%' }}>
            <div style={{
              width: '100%',
              height: Math.max(d.load * barH, 2),
              background: styleColor(d.style),
              border: d.today ? `1.5px solid ${T.textPrimary}` : 'none',
            }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
        {days.map(d => (
          <div key={d.day} style={{ flex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <MonoLabel size={9} color={d.today ? T.textPrimary : T.textDim}>{d.day}</MonoLabel>
            <MonoLabel size={8} color={T.textGhost}>{d.date}</MonoLabel>
          </div>
        ))}
      </div>
    </TactCard>
  );
}

function UpcomingProjection() {
  const rows = [
    { day: 'WED 14', target: 'Easy + strides', dist: '6.5 km' },
    { day: 'THU 15', target: 'Tempo · 4×8min', dist: '12.0 km' },
    { day: 'SAT 17', target: 'Long run · steady', dist: '24.0 km' },
  ];
  return (
    <div>
      <SectionHead label="UPCOMING SESSIONS" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {rows.map(r => (
          <div key={r.day} style={{
            display: 'flex', gap: 10, padding: '12px 14px',
            background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 8,
          }}>
            <div style={{ width: 55 }}>
              <MonoLabel size={10} color={T.textPrimary}>{r.day}</MonoLabel>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: T.ui, fontSize: 13, color: T.textPrimary }}>{r.target}</div>
              <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, marginTop: 2 }}>{r.dist}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { TrajectoryScreen });
