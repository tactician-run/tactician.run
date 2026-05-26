// Tokens — transcribed verbatim from Xcode Files/Tactician/Utilities/Tokens.swift
// (Dark-mode-only snapshot used by the in-app screens.)

const T = {
  // Backgrounds
  bgBase:       '#0D0D0C',
  bgRaised:     '#1A1A19',
  bgCard:       '#23231F',
  bgElevated:   '#2E2E2A',
  bgSubtle:     '#3A3A36',
  bgInk:        '#070706',
  bgActive:     '#FFFFFF',
  bgActiveCard: '#D8D8D5',

  // Text
  textOnActive:  '#0A0A09',
  textPrimary:   '#F3F3F2',
  textSecondary: '#C1C1BE',
  textMuted:     '#A8A8A4',
  textDim:       '#757570',
  textGhost:     '#454541',

  // Border
  border:     '#2E2E2A',
  borderSoft: '#23231F',

  // Status
  ok:   '#12A12A',
  warn: '#FFAA00',
  hot:  '#D42B25',

  // Type
  ui:   "'Inter Tight', system-ui, -apple-system, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace",
};

function toneColor(tone) {
  if (tone === 'ok')   return T.ok;
  if (tone === 'warn') return T.warn;
  if (tone === 'hot')  return T.hot;
  return T.textPrimary;
}

// MonoLabel — mirrors MonoLabel atom (JetBrains Mono, uppercase, tracked).
function MonoLabel({ children, size = 10, color = T.textDim, weight = 500, tracking = 0.14, upper = true, style = {} }) {
  return (
    <span style={{
      fontFamily: T.mono, fontSize: size, fontWeight: weight, color,
      letterSpacing: `${tracking}em`,
      textTransform: upper ? 'uppercase' : 'none',
      ...style,
    }}>{children}</span>
  );
}

// StatusDot — solid circle with optional radiating pulse.
function StatusDot({ color, size = 6, pulse = false }) {
  const outer = pulse ? size * 3 : size;
  return (
    <span style={{
      position: 'relative', display: 'inline-block',
      width: outer, height: outer,
    }}>
      {pulse && (
        <span style={{
          position: 'absolute', left: outer / 2 - size / 2, top: outer / 2 - size / 2,
          width: size, height: size, borderRadius: 999,
          background: color, opacity: 0.5,
          animation: 'tactPulse 1.8s ease-out infinite',
        }} />
      )}
      <span style={{
        position: 'absolute', left: outer / 2 - size / 2, top: outer / 2 - size / 2,
        width: size, height: size, borderRadius: 999, background: color,
      }} />
    </span>
  );
}

// TacticianLogo — 18×18 outlined square w/ 6×6 inner solid square (matches SwiftUI).
function TacticianLogo({ size = 18 }) {
  const inner = Math.round(size * 6 / 18);
  return (
    <span style={{
      width: size, height: size, border: `1px solid ${T.textPrimary}`,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <span style={{ width: inner, height: inner, background: T.textPrimary }} />
    </span>
  );
}

// TactCard — bordered surface. dark=true switches to bgInk.
function TactCard({ children, dark = false, padding = 14, borderColor, style = {} }) {
  return (
    <div style={{
      background: dark ? T.bgInk : T.bgCard,
      border: `1px solid ${borderColor || T.border}`,
      borderRadius: 8, padding,
      ...style,
    }}>{children}</div>
  );
}

// TactTag — tone-colored mono badge w/ outlined fill.
function TactTag({ children, tone = 'default' }) {
  const c = toneColor(tone);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: T.mono, fontSize: 9, fontWeight: 600, letterSpacing: '0.16em',
      textTransform: 'uppercase', color: c, padding: '0 8px', height: 20,
      background: c + '14', border: `1px solid ${c}66`,
    }}>{children}</span>
  );
}

// MetricCell — DURATION / TARGET PACE / MAX HR units in the directive hero.
function MetricCell({ label, value, unit }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 6,
      padding: '10px 12px', flex: 1,
    }}>
      <MonoLabel size={9}>{label}</MonoLabel>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontFamily: T.mono, fontSize: 18, fontWeight: 500, color: T.textPrimary }}>{value}</span>
        <MonoLabel size={9}>{unit}</MonoLabel>
      </div>
    </div>
  );
}

// KVMetric — compact label+value used in the load-metrics strip.
function KVMetric({ label, value, unit = '', tone = 'default' }) {
  const c = toneColor(tone);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <MonoLabel size={9}>{label}</MonoLabel>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
        <span style={{ fontFamily: T.mono, fontSize: 14, fontWeight: 500, color: c }}>{value}</span>
        {unit && <MonoLabel size={9}>{unit}</MonoLabel>}
      </div>
    </div>
  );
}

// CornersOverlay — decorative L-marks at 8px inset (the "directive" hero frame).
function CornersOverlay() {
  const arm = 10, ins = 8;
  const base = { position: 'absolute', width: arm, height: arm, pointerEvents: 'none' };
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <div style={{ ...base, top: ins, left: ins,
        borderTop: `1px solid ${T.textGhost}`, borderLeft: `1px solid ${T.textGhost}` }} />
      <div style={{ ...base, top: ins, right: ins,
        borderTop: `1px solid ${T.textGhost}`, borderRight: `1px solid ${T.textGhost}` }} />
      <div style={{ ...base, bottom: ins, left: ins,
        borderBottom: `1px solid ${T.textGhost}`, borderLeft: `1px solid ${T.textGhost}` }} />
      <div style={{ ...base, bottom: ins, right: ins,
        borderBottom: `1px solid ${T.textGhost}`, borderRight: `1px solid ${T.textGhost}` }} />
    </div>
  );
}

// TopChromeView — logo + wordmark + screen label + right readouts (ACR / days / week / ENGINE)
function TopChrome({ screen, sub, acr = '1.34', acrTone = 'warn', daysToRace = 42, week = 8, totalWeeks = 12, engine = true }) {
  const acrColor = toneColor(acrTone);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '12px 16px',
      borderBottom: `1px solid ${T.borderSoft}`,
    }}>
      <TacticianLogo size={18} />
      <MonoLabel size={11} color={T.textPrimary} weight={600} tracking={0.22}>TACTICIAN</MonoLabel>
      {screen && (
        <MonoLabel size={9} color={T.textGhost}>
          {sub ? `${screen} · ${sub}` : screen}
        </MonoLabel>
      )}
      <span style={{ flex: 1 }} />
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
        <StatusDot color={acrColor} size={5} />
        <MonoLabel size={9} color={acrColor}>ACR {acr}</MonoLabel>
      </span>
      <MonoLabel size={9}>{daysToRace}D</MonoLabel>
      <MonoLabel size={9}>WK {week}/{totalWeeks}</MonoLabel>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
        <StatusDot color={engine ? T.ok : T.textDim} size={5} pulse={engine} />
        <MonoLabel size={9}>ENGINE</MonoLabel>
      </span>
    </div>
  );
}

// SubHeaderView — sheet header (WHY, MODIFY, DEFER drilldowns).
function SubHeader({ title, sub, rightLabel = 'BACK', onClose }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '12px 16px',
      borderBottom: `1px solid ${T.borderSoft}`,
    }}>
      <TacticianLogo size={18} />
      <MonoLabel size={11} color={T.textPrimary} weight={600} tracking={0.22}>{title}</MonoLabel>
      {sub && <MonoLabel size={9} color={T.textGhost}>{sub}</MonoLabel>}
      <span style={{ flex: 1 }} />
      <button onClick={onClose} style={{
        background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 6,
      }}>
        <MonoLabel size={10} color={T.textPrimary} weight={600} tracking={0.22}>{rightLabel}</MonoLabel>
        <span style={{ fontFamily: T.mono, fontSize: 12, color: T.textPrimary }}>×</span>
      </button>
    </div>
  );
}

// BottomNavView — three-tab bar with 2px active indicator (COMMAND/TRAJECTORY/SYSTEM).
function BottomNav({ active = 'COMMAND', onSelect = () => {} }) {
  const tabs = ['COMMAND', 'TRAJECTORY', 'SYSTEM'];
  return (
    <div style={{
      background: T.bgRaised,
      borderTop: `1px solid ${T.border}`,
    }}>
      <div style={{ display: 'flex', padding: '10px 18px 6px' }}>
        {tabs.map(tab => {
          const on = tab === active;
          return (
            <button key={tab} onClick={() => onSelect(tab)} style={{
              flex: 1, background: 'transparent', border: 'none', padding: 0,
              display: 'flex', flexDirection: 'column', cursor: 'pointer',
            }}>
              <div style={{ height: 2, background: on ? T.textPrimary : 'transparent' }} />
              <div style={{
                fontFamily: T.ui, fontSize: 10, fontWeight: 500, letterSpacing: '0.2em',
                textTransform: 'uppercase', padding: '8px 0',
                color: on ? T.textPrimary : T.textGhost,
              }}>{tab}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// SectionHead — section title with optional right label.
function SectionHead({ label, right, color = T.textPrimary }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      padding: '22px 2px 10px',
    }}>
      <MonoLabel size={10} color={color} weight={600} tracking={0.22}>{label}</MonoLabel>
      <span style={{ flex: 1 }} />
      {right && <MonoLabel size={9}>{right}</MonoLabel>}
    </div>
  );
}

// KVRow — key/value row inside an outlined card (e.g. INPUTS USED).
function KVRow({ k, v, warn = false, last = false }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 14px',
      borderBottom: last ? 'none' : `1px solid ${T.border}`,
    }}>
      <MonoLabel size={10}>{k}</MonoLabel>
      <span style={{
        fontFamily: T.mono, fontSize: 12, fontWeight: 500,
        color: warn ? T.warn : T.textPrimary,
      }}>{v}</span>
    </div>
  );
}

// TraceStep — numbered decision-trace step.
function TraceStep({ title, detail, status = 'info', isLast = false }) {
  const c = status === 'fired' ? T.warn : status === 'action' ? T.textPrimary : T.textMuted;
  const icon = status === 'fired' ? '●' : status === 'action' ? '■' : '○';
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'stretch' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 14 }}>
        <span style={{ fontFamily: T.mono, fontSize: 10, color: c }}>{icon}</span>
        {!isLast && <div style={{ flex: 1, width: 1, background: T.border, marginTop: 2 }} />}
      </div>
      <div style={{ paddingBottom: isLast ? 0 : 14, flex: 1 }}>
        <MonoLabel size={10} color={c} weight={600} tracking={0.2}>{title}</MonoLabel>
        <div style={{ fontFamily: T.ui, fontSize: 12, color: T.textMuted, marginTop: 4 }}>{detail}</div>
      </div>
    </div>
  );
}

// AltRowView — alternative considered (in Why).
function AltRow({ label, reason, selected = false }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: 12,
      background: selected ? T.bgCard : T.bgRaised,
      border: `1px solid ${selected ? T.ok : T.border}`,
      borderRadius: 6,
    }}>
      <div style={{ flex: 1 }}>
        <MonoLabel size={10} color={selected ? T.textPrimary : T.textMuted} weight={600} tracking={0.18}>{label}</MonoLabel>
        <div style={{ fontFamily: T.ui, fontSize: 12, color: selected ? T.ok : T.textDim, marginTop: 3 }}>{reason}</div>
      </div>
      {selected && (
        <span style={{ fontFamily: T.mono, fontSize: 12, fontWeight: 500, color: T.ok }}>✓</span>
      )}
    </div>
  );
}

Object.assign(window, {
  T, toneColor,
  MonoLabel, StatusDot, TacticianLogo,
  TactCard, TactTag, MetricCell, KVMetric, KVRow,
  CornersOverlay,
  TopChrome, SubHeader, BottomNav, SectionHead,
  TraceStep, AltRow,
});
