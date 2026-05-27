const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const LOOPS_FORM_URL = 'https://app.loops.so/api/newsletter-form/cmp7nu95314qb0izf0kva23ds';
const FOUNDING_LIMIT = 100;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { firstName, email, goalRace, experienceLevel } = req.body ?? {};

  if (!firstName || !email) {
    return res.status(400).json({ success: false, message: 'Name and email are required' });
  }

  try {
    // Atomically claim a seat. INCR returns the value after increment, so
    // the first 100 callers get newCount 1–100 and are founding athletes.
    const newCount = await redis.incr('founding_athlete_count');
    const foundingAthlete = newCount <= FOUNDING_LIMIT;
    const seatsRemaining = Math.max(0, FOUNDING_LIMIT - newCount);

    // Forward to Loops
    const loopsBody = new URLSearchParams({
      firstName,
      email,
      userGroup: 'waitlist',
      foundingAthlete: String(foundingAthlete),
    });
    if (goalRace)        loopsBody.set('goalRace', goalRace);
    if (experienceLevel) loopsBody.set('experienceLevel', experienceLevel);

    const loopsRes = await fetch(LOOPS_FORM_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: loopsBody.toString(),
    });

    if (loopsRes.status === 429) {
      return res.status(429).json({ success: false, message: 'Too many requests — please try again in a moment' });
    }

    const loopsData = await loopsRes.json().catch(() => null);

    if (!loopsRes.ok || (loopsData && loopsData.success === false)) {
      return res.status(502).json({
        success: false,
        message: (loopsData && loopsData.message) || 'Submission failed — please try again',
      });
    }

    return res.status(200).json({ success: true, foundingAthlete, seatsRemaining });
  } catch (err) {
    console.error('subscribe error:', err);
    return res.status(500).json({ success: false, message: 'Server error — please try again' });
  }
};
