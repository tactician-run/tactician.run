// tweaks.jsx — minimal tweaks panel for the Tactician landing page.
// Exposes hero copy + CTAs. No brand accent — colors are status-bound.

(function () {
  const { useEffect } = React;

  const DEFAULTS = /*EDITMODE-BEGIN*/{
    "hero_eyebrow": "Engine · v0.9 · Pre-launch",
    "hero_headline": "Stop executing the plan. Start executing the right plan.",
    "hero_sub": "Your training plan doesn't know what happened last week. Tactician does.",
    "primary_cta": "Join Founding Athlete Waitlist",
    "secondary_cta": "See How It Works",
    "show_positioning": true
  }/*EDITMODE-END*/;

  function applyTweaks(t) {
    const h1 = document.querySelector('.hero .t-hero');
    if (h1) h1.textContent = t.hero_headline;
    // First .t-lede in the hero is the bold sub-headline. Leave the
    // second one (product description) untouched — it's not a tweak.
    const ledes = document.querySelectorAll('.hero .t-lede');
    if (ledes[0]) ledes[0].textContent = t.hero_sub;
    const eyebrow = document.querySelector('.hero .hero-status:first-child span:last-child');
    if (eyebrow) eyebrow.textContent = t.hero_eyebrow;
    const pCta = document.querySelector('.hero-cta .btn-primary');
    if (pCta && pCta.firstChild) pCta.firstChild.textContent = t.primary_cta;
    const sCta = document.querySelector('.hero-cta .btn-secondary');
    if (sCta) sCta.textContent = t.secondary_cta;
    const positioning = document.querySelector('.positioning');
    if (positioning) positioning.style.display = t.show_positioning ? '' : 'none';
  }

  function App() {
    const [t, setT] = useTweaks(DEFAULTS);
    useEffect(() => { applyTweaks(t); }, [t]);

    return (
      <TweaksPanel title="Tweaks">
        <TweakSection title="Hero copy">
          <TweakText label="Eyebrow"     value={t.hero_eyebrow}  onChange={v => setT('hero_eyebrow', v)} />
          <TweakText label="Headline"    value={t.hero_headline} onChange={v => setT('hero_headline', v)} multiline />
          <TweakText label="Subheadline" value={t.hero_sub}      onChange={v => setT('hero_sub', v)} multiline />
        </TweakSection>

        <TweakSection title="CTAs">
          <TweakText label="Primary"   value={t.primary_cta}   onChange={v => setT('primary_cta', v)} />
          <TweakText label="Secondary" value={t.secondary_cta} onChange={v => setT('secondary_cta', v)} />
        </TweakSection>

        <TweakSection title="Sections">
          <TweakToggle label="Positioning strip" value={t.show_positioning} onChange={v => setT('show_positioning', v)} />
        </TweakSection>
      </TweaksPanel>
    );
  }

  function boot() {
    const root = document.getElementById('tweaks-mount');
    if (root) ReactDOM.createRoot(root).render(<App />);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
