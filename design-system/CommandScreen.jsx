// CommandScreen — recreates Tactician/Views/Command/CommandView.swift
// Hero directive card matches Screenshot 2026-05-13 at 9.15.22 PM.png exactly.

function CommandScreen({ onWhy, onModify }) {
  return (
    <div style={{ background: T.bgBase, minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <TopChrome screen="COMMAND" sub="TUE · 04:42" acr="1.34" acrTone="warn" daysToRace={42} week={8} totalWeeks={12} />

      <div style={{ flex: 1, overflow: 'auto', padding: '16px 16px 0' }}>
        <DirectiveHero onWhy={onWhy} onModify={onModify} />
        <FrictionSection />
        <UpcomingSection />
        <div style={{ height: 16 }} />
      </div>

      <BottomNav active="COMMAND" />
    </div>
  );
}

// Hero directive card — DIRECTIVE · ADJUSTED + huge title + why-callout + metrics + CTAs
function DirectiveHero({ onWhy, onModify }) {
  return (
    <div style={{ position: 'relative' }}>
      <TactCard padding={18}>
        {/* Top: dot + DIRECTIVE · ADJUSTED + timestamp */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <StatusDot color={T.warn} size={7} pulse />
          <MonoLabel size={10} color={T.warn} weight={600} tracking={0.2}>DIRECTIVE · ADJUSTED</MonoLabel>
          <span style={{ flex: 1 }} />
          <MonoLabel size={9} color={T.textDim}>04:42 LOCAL</MonoLabel>
        </div>

        {/* Title — 32pt SemiBold, tight tracking */}
        <div style={{
          fontFamily: T.ui, fontSize: 32, fontWeight: 600, lineHeight: 1.05,
          letterSpacing: '-0.03em', color: T.textPrimary, marginBottom: 6,
        }}>Recovery run.</div>

        {/* Subtitle — 16pt Medium muted */}
        <div style={{
          fontFamily: T.ui, fontSize: 16, fontWeight: 500, color: T.textMuted,
          letterSpacing: '-0.015em', marginBottom: 16,
        }}>40 min · zone 1 · 6:10/km</div>

        {/* Why-the-change callout — bgInk + warn left bar */}
        <div style={{
          position: 'relative', background: T.bgInk,
          padding: '12px 14px', marginBottom: 14,
        }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: T.warn,
          }} />
          <div style={{ marginBottom: 6 }}>
            <MonoLabel size={9} color={T.warn} weight={600} tracking={0.18}>WHY THE CHANGE</MonoLabel>
          </div>
          <div style={{ fontFamily: T.ui, fontSize: 13, color: T.textSecondary, lineHeight: 1.45 }}>
            Replaces planned <span style={{ color: T.textGhost, textDecoration: 'line-through' }}>8×800m intervals</span>. Engine flagged intensity stacking — two hard sessions inside 5 days, ACR 1.34 above ceiling.
          </div>
        </div>

        {/* Three-metric grid w/ vertical dividers, bordered */}
        <div style={{
          display: 'flex', border: `1px solid ${T.border}`, marginBottom: 18,
        }}>
          <MetricCell label="DURATION" value="40:00" unit="MIN" />
          <div style={{ width: 1, background: T.border }} />
          <MetricCell label="TARGET PACE" value="6:10" unit="/KM" />
          <div style={{ width: 1, background: T.border }} />
          <MetricCell label="MAX HR" value="142" unit="BPM" />
        </div>

        {/* Slide-to-confirm primary CTA */}
        <div style={{
          height: 56, background: T.bgActive, color: T.textOnActive,
          borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 22px', marginBottom: 8,
          fontFamily: T.ui, fontSize: 13, fontWeight: 600,
          letterSpacing: '0.18em', textTransform: 'uppercase',
        }}>
          <span>Accept Directive</span>
          <span style={{ fontSize: 14 }}>▶</span>
        </div>

        {/* Three secondary actions — different treatments */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 60px', gap: 6 }}>
          <button onClick={onWhy} style={{
            height: 44, background: 'transparent', border: `1px solid ${T.border}`,
            borderRadius: 6, color: T.textPrimary, cursor: 'pointer',
            fontFamily: T.ui, fontSize: 12, fontWeight: 600,
            letterSpacing: '0.2em', textTransform: 'uppercase',
          }}>Why?</button>
          <button onClick={onModify} style={{
            height: 44, background: 'transparent', border: `1px solid ${T.border}`,
            borderRadius: 6, color: T.textMuted, cursor: 'pointer',
            fontFamily: T.ui, fontSize: 11, fontWeight: 500,
            letterSpacing: '0.18em', textTransform: 'uppercase',
          }}>Modify</button>
          <button style={{
            height: 44, background: 'transparent', border: `1px solid ${T.borderSoft}`,
            borderRadius: 6, color: T.textGhost, cursor: 'pointer',
            fontFamily: T.ui, fontSize: 9, fontWeight: 500,
            letterSpacing: '0.14em', textTransform: 'uppercase',
          }}>Defer</button>
        </div>
      </TactCard>

      {/* Decorative L-corners, drawn over the card edges */}
      <CornersOverlay />
    </div>
  );
}

// FRICTION section — protection flags fired by the engine
function FrictionSection() {
  return (
    <>
      <SectionHead label="FRICTION" right="2 SIGNALS" color={T.warn} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <FrictionCard
          tone="warn"
          tag="INTENSITY STACK"
          title="Back-to-back hard sessions"
          metric="2 HARD"
          target="≤ 3 / 7d"
          desc="Hard sessions capped. Next hard session gated."
        />
        <FrictionCard
          tone="hot"
          tag="LOAD CEILING"
          title="Acute load above ceiling"
          metric="ACR 1.34"
          target="≤ 1.50"
          desc="Tactician will hold intensity until ratio normalizes."
        />
      </div>
    </>
  );
}

function FrictionCard({ tone, tag, title, metric, target, desc }) {
  const c = toneColor(tone);
  return (
    <div style={{
      position: 'relative', display: 'flex', gap: 12,
      background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 8,
      padding: '14px 14px 14px 22px', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: c }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <MonoLabel size={9} color={c} weight={600} tracking={0.2}>{tag}</MonoLabel>
        <div style={{ fontFamily: T.ui, fontSize: 14, fontWeight: 500, color: T.textPrimary }}>{title}</div>
        <div style={{ fontFamily: T.ui, fontSize: 12, color: T.textSecondary, lineHeight: 1.4 }}>{desc}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
        <span style={{ fontFamily: T.mono, fontSize: 14, fontWeight: 600, color: c }}>{metric}</span>
        <MonoLabel size={9}>TGT {target}</MonoLabel>
      </div>
    </div>
  );
}

// UPCOMING SESSIONS — bordered list of next sessions
function UpcomingSection() {
  const rows = [
    { day: 'WED 14', target: 'Easy + strides', detail: '6.5 km' },
    { day: 'THU 15', target: 'Tempo · 4×8min @ T', detail: '12.0 km' },
    { day: 'FRI 16', target: 'Recovery', detail: '5.0 km' },
    { day: 'SAT 17', target: 'Long run · steady', detail: '24.0 km' },
    { day: 'SUN 18', target: 'Rest', detail: 'REST' },
  ];
  return (
    <>
      <SectionHead label="UPCOMING SESSIONS" right="NEXT 5" />
      <div style={{
        border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden',
      }}>
        {rows.map((r, i) => (
          <div key={r.day} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: 12,
            background: T.bgRaised,
            borderBottom: i === rows.length - 1 ? 'none' : `1px solid ${T.border}`,
          }}>
            <div style={{ width: 55 }}>
              <MonoLabel size={10} color={T.textPrimary}>{r.day}</MonoLabel>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: T.ui, fontSize: 13, color: T.textPrimary }}>{r.target}</div>
              <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, marginTop: 2 }}>{r.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

Object.assign(window, { CommandScreen });
