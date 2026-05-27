const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const FOUNDING_LIMIT = 100;

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const raw = await redis.get('founding_athlete_count');
    const claimed = Math.min(Number(raw ?? 0), FOUNDING_LIMIT);
    return res.status(200).json({ claimed, remaining: FOUNDING_LIMIT - claimed, total: FOUNDING_LIMIT });
  } catch (err) {
    console.error('seats error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
