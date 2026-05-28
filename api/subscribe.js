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
    const foundingAthleteNumber = foundingAthlete ? newCount : null;

    // Step 1 — Create/update the contact
    const contactPayload = {
      email,
      firstName,
      userGroup: 'waitlist',
      foundingAthlete: Boolean(foundingAthlete),
    };
    if (foundingAthleteNumber !== null) contactPayload.foundingAthleteNumber = foundingAthleteNumber;
    if (goalRace)        contactPayload.goalRace = goalRace;
    if (experienceLevel) contactPayload.experienceLevel = experienceLevel;

    console.log('Loops contact request body:', JSON.stringify(contactPayload));

    const contactRes = await fetch('https://app.loops.so/api/v1/contacts/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loopsApiKey}`,
      },
      body: JSON.stringify(contactPayload),
    });

    console.log('Loops contact response status:', contactRes.status);

    if (contactRes.status === 429) {
      return res.status(429).json({ success: false, message: 'Too many requests — please try again in a moment' });
    }

    const contactData = await contactRes.json().catch((e) => {
      console.error('Loops contact JSON parse error:', e);
      return null;
    });

    console.log('Loops contact response data:', JSON.stringify(contactData));

    if (!contactRes.ok || (contactData && contactData.success === false)) {
      console.error('Loops contact creation failed:', contactRes.status, JSON.stringify(contactData));
      return res.status(502).json({
        success: false,
        message: (contactData && contactData.message) || 'Submission failed — please try again',
      });
    }

    // Step 2 — Trigger the waitlistSignup event
    const eventPayload = { email, eventName: 'waitlistSignup' };
    console.log('Loops event request body:', JSON.stringify(eventPayload));

    const eventRes = await fetch('https://app.loops.so/api/v1/events/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loopsApiKey}`,
      },
      body: JSON.stringify(eventPayload),
    });

    console.log('Loops event response status:', eventRes.status);

    if (eventRes.status === 429) {
      return res.status(429).json({ success: false, message: 'Too many requests — please try again in a moment' });
    }

    const eventData = await eventRes.json().catch((e) => {
      console.error('Loops event JSON parse error:', e);
      return null;
    });

    console.log('Loops event response data:', JSON.stringify(eventData));

    if (!eventRes.ok || (eventData && eventData.success === false)) {
      console.error('Loops event trigger failed:', eventRes.status, JSON.stringify(eventData));
      return res.status(502).json({
        success: false,
        message: (eventData && eventData.message) || 'Event trigger failed — please try again',
      });
    }

    // Step 3 — Send confirmation email (one per signup, branch on founding status)
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

    console.log('Loops transactional request body:', JSON.stringify(txPayload));

    const txRes = await fetch('https://app.loops.so/api/v1/transactional', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loopsApiKey}`,
      },
      body: JSON.stringify(txPayload),
    });

    console.log('Loops transactional response status:', txRes.status);

    const txData = await txRes.json().catch((e) => {
      console.error('Loops transactional JSON parse error:', e);
      return null;
    });

    console.log('Loops transactional response data:', JSON.stringify(txData));

    return res.status(200).json({ success: true, foundingAthlete, seatsRemaining, foundingAthleteNumber });
  } catch (err) {
    console.error('subscribe error:', err);
    return res.status(500).json({ success: false, message: 'Server error — please try again' });
  }
};
