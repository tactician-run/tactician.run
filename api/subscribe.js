const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const FOUNDING_LIMIT = 100;

// Rate limit: 5 requests per IP per 10 minutes.
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_SECONDS = 600;

// Length caps for incoming fields.
const MAX_NAME = 100;
const MAX_EMAIL = 254;
const MAX_FIELD = 200;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Returns undefined if absent, a trimmed string if valid, or null if the value
// is present but not a string / too long.
function optionalString(value, max) {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== 'string') return null;
  if (value.length > max) return null;
  return value.trim();
}

function clientIp(req) {
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string' && xff.length > 0) {
    return xff.split(',')[0].trim();
  }
  return (req.socket && req.socket.remoteAddress) || 'unknown';
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const loopsApiKey = process.env.LOOPS_API_KEY;
  if (!loopsApiKey) {
    console.error('LOOPS_API_KEY is not set');
    return res.status(500).json({ success: false, message: 'Server configuration error.' });
  }

  let seatClaimed = false;   // we hold the per-email claim
  let contactCreated = false; // Loops contact create has succeeded
  let emailKey = null;

  try {
    // ── Rate limiting (per IP, INCR + EXPIRE) ──────────────────────────────
    const ip = clientIp(req);
    const rlKey = `rl:subscribe:${ip}`;
    const hits = await redis.incr(rlKey);
    if (hits === 1) {
      await redis.expire(rlKey, RATE_LIMIT_WINDOW_SECONDS);
    }
    if (hits > RATE_LIMIT_MAX) {
      return res.status(429).json({ success: false, message: 'Too many requests. Please try again later.' });
    }

    // ── Input validation ───────────────────────────────────────────────────
    const body = req.body ?? {};

    const rawFirstName = body.firstName;
    const rawEmail = body.email;

    if (typeof rawFirstName !== 'string' || typeof rawEmail !== 'string') {
      return res.status(400).json({ success: false, message: 'Please enter a valid name and email.' });
    }

    const firstName = rawFirstName.trim();
    const email = rawEmail.trim().toLowerCase();

    if (
      firstName.length === 0 || firstName.length > MAX_NAME ||
      email.length === 0 || email.length > MAX_EMAIL ||
      !EMAIL_RE.test(email)
    ) {
      return res.status(400).json({ success: false, message: 'Please enter a valid name and email.' });
    }

    const goalRace = optionalString(body.goalRace, MAX_FIELD);
    const experienceLevel = optionalString(body.experienceLevel, MAX_FIELD);
    const utm_source = optionalString(body.utm_source, MAX_FIELD);
    const utm_medium = optionalString(body.utm_medium, MAX_FIELD);
    const utm_campaign = optionalString(body.utm_campaign, MAX_FIELD);
    const utm_content = optionalString(body.utm_content, MAX_FIELD);

    if (
      goalRace === null || experienceLevel === null ||
      utm_source === null || utm_medium === null ||
      utm_campaign === null || utm_content === null
    ) {
      return res.status(400).json({ success: false, message: 'Invalid request.' });
    }

    // ── Atomic per-email seat claim ─────────────────────────────────────────
    // SET NX guarantees only one request can take a seat for a given email,
    // even if two arrive simultaneously. A repeat signup fails the claim and
    // returns the original result without incrementing the counter.
    emailKey = `seat:${email}`;
    const claim = await redis.set(emailKey, 'pending', { nx: true });

    if (claim === null) {
      // Duplicate email — do not increment, do not resend confirmation.
      let stored = await redis.get(emailKey);
      if (stored === 'pending') {
        // A concurrent request for the same email is still mid-flight. Give it
        // a brief moment to finalize, then read again.
        await sleep(200);
        stored = await redis.get(emailKey);
      }

      const currentCount = Number((await redis.get('founding_athlete_count')) ?? 0);
      const seatsRemaining = Math.max(0, FOUNDING_LIMIT - currentCount);

      if (stored && typeof stored === 'object') {
        return res.status(200).json({
          success: true,
          foundingAthlete: Boolean(stored.f),
          seatsRemaining,
          foundingAthleteNumber: stored.f ? stored.n : null,
        });
      }

      // Still pending (rare): respond without issuing a number or an email.
      return res.status(200).json({
        success: true,
        foundingAthlete: currentCount <= FOUNDING_LIMIT,
        seatsRemaining,
        foundingAthleteNumber: null,
      });
    }

    seatClaimed = true;

    // We own the claim, so this is the only increment for this email.
    const newCount = await redis.incr('founding_athlete_count');
    const foundingAthlete = newCount <= FOUNDING_LIMIT;
    const seatsRemaining = Math.max(0, FOUNDING_LIMIT - newCount);
    const foundingAthleteNumber = foundingAthlete ? newCount : null;

    // ── Step 1 — Create/update the Loops contact ────────────────────────────
    const contactPayload = {
      email,
      firstName,
      userGroup: 'waitlist',
      foundingAthlete: Boolean(foundingAthlete),
    };
    if (foundingAthleteNumber !== null) contactPayload.foundingAthleteNumber = foundingAthleteNumber;
    if (goalRace)        contactPayload.goalRace = goalRace;
    if (experienceLevel) contactPayload.experienceLevel = experienceLevel;
    if (utm_source)      contactPayload.utm_source = utm_source;
    if (utm_medium)      contactPayload.utm_medium = utm_medium;
    if (utm_campaign)    contactPayload.utm_campaign = utm_campaign;
    if (utm_content)     contactPayload.utm_content = utm_content;

    const contactRes = await fetch('https://app.loops.so/api/v1/contacts/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loopsApiKey}`,
      },
      body: JSON.stringify(contactPayload),
    });

    const contactData = await contactRes.json().catch(() => {
      console.error('Loops contact JSON parse error');
      return null;
    });

    if (contactRes.status === 429) {
      console.error('Loops contact rate limited, status: 429');
      // Signup did not complete. Release the claim and leave the counter alone
      // so the person can retry without being blocked by their own claim.
      await redis.del(emailKey);
      seatClaimed = false;
      return res.status(429).json({ success: false, message: 'Too many requests. Please try again in a moment.' });
    }

    if (!contactRes.ok || (contactData && contactData.success === false)) {
      console.error('Loops contact creation failed, status:', contactRes.status);
      await redis.del(emailKey);
      seatClaimed = false;
      return res.status(502).json({ success: false, message: 'Signup failed. Please try again.' });
    }

    contactCreated = true;

    // ── Step 2 — Trigger the waitlistSignup event ───────────────────────────
    // Contact already exists at this point, so the seat stays claimed on
    // failure (the person is on the list) and we return a generic error.
    const eventPayload = { email, eventName: 'waitlistSignup' };

    const eventRes = await fetch('https://app.loops.so/api/v1/events/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loopsApiKey}`,
      },
      body: JSON.stringify(eventPayload),
    });

    const eventData = await eventRes.json().catch(() => {
      console.error('Loops event JSON parse error');
      return null;
    });

    if (eventRes.status === 429) {
      console.error('Loops event rate limited, status: 429');
      return res.status(429).json({ success: false, message: 'Too many requests. Please try again in a moment.' });
    }

    if (!eventRes.ok || (eventData && eventData.success === false)) {
      console.error('Loops event trigger failed, status:', eventRes.status);
      return res.status(502).json({ success: false, message: 'Signup failed. Please try again.' });
    }

    // ── Step 3 — Send confirmation email (one per signup) ───────────────────
    const txPayload = foundingAthlete
      ? {
          transactionalId: 'cmpq13v9702sh0jzy84u4gual',
          email,
          dataVariables: { firstName, foundingAthleteNumber },
        }
      : {
          transactionalId: 'cmpq1gga303qs0jv349o6cgmv',
          email,
          dataVariables: { firstName },
        };

    const txRes = await fetch('https://app.loops.so/api/v1/transactional', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loopsApiKey}`,
      },
      body: JSON.stringify(txPayload),
    });

    if (!txRes.ok) {
      // Non-fatal: the contact and event succeeded, so the signup stands.
      console.error('Loops transactional send failed, status:', txRes.status);
    }

    // Finalize the seat record so future duplicate submits read the original
    // result instead of re-claiming.
    await redis.set(emailKey, { f: foundingAthlete, n: foundingAthleteNumber });

    return res.status(200).json({ success: true, foundingAthlete, seatsRemaining, foundingAthleteNumber });
  } catch (err) {
    console.error('subscribe error:', err && err.name ? err.name : 'error');
    // If we claimed a seat but never confirmed the Loops contact, release the
    // claim so the person can retry. Leave the counter alone to avoid handing
    // out a duplicate founding number.
    if (seatClaimed && !contactCreated && emailKey) {
      try {
        await redis.del(emailKey);
      } catch (_) {}
    }
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};
