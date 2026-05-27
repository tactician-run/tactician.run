const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const FOUNDING_LIMIT = 100;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { firstName, email, goalRace, experienceLevel } = req.body ?? {};

  if (!firstName || !email) {
    return res.status(400).json({ success: false, message: 'Name and email are required' });
  }

  const loopsApiKey = process.env.LOOPS_API_KEY;
  if (!loopsApiKey) {
    console.error('LOOPS_API_KEY is not set');
    return res.status(500).json({ success: false, message: 'Server configuration error' });
  }

  try {
    const newCount = await redis.incr('founding_athlete_count');
    const foundingAthlete = newCount <= FOUNDING_LIMIT;
    const seatsRemaining = Math.max(0, FOUNDING_LIMIT - newCount);

    // Step 1 — Create/update the contact
    const contactPayload = {
      email,
      firstName,
      userGroup: 'waitlist',
      foundingAthlete,
    };
    if (goalRace)        contactPayload.goalRace = goalRace;
    if (experienceLevel) contactPayload.experienceLevel = experienceLevel;

    const contactRes = await fetch('https://api.loops.so/v1/contacts/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loopsApiKey}`,
      },
      body: JSON.stringify(contactPayload),
    });

    if (contactRes.status === 429) {
      return res.status(429).json({ success: false, message: 'Too many requests — please try again in a moment' });
    }

    const contactData = await contactRes.json().catch(() => null);

    if (!contactRes.ok || (contactData && contactData.success === false)) {
      return res.status(502).json({
        success: false,
        message: (contactData && contactData.message) || 'Submission failed — please try again',
      });
    }

    // Step 2 — Trigger the waitlistSignup event
    const eventRes = await fetch('https://api.loops.so/v1/events/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loopsApiKey}`,
      },
      body: JSON.stringify({ email, eventName: 'waitlistSignup' }),
    });

    if (eventRes.status === 429) {
      return res.status(429).json({ success: false, message: 'Too many requests — please try again in a moment' });
    }

    const eventData = await eventRes.json().catch(() => null);

    if (!eventRes.ok || (eventData && eventData.success === false)) {
      return res.status(502).json({
        success: false,
        message: (eventData && eventData.message) || 'Event trigger failed — please try again',
      });
    }

    return res.status(200).json({ success: true, foundingAthlete, seatsRemaining });
  } catch (err) {
    console.error('subscribe error:', err);
    return res.status(500).json({ success: false, message: 'Server error — please try again' });
  }
};
