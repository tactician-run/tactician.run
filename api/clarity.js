// Microsoft Clarity config for the static page.
// Returns the project ID only on the Production deployment with CLARITY_PROJECT_ID set.
// Local dev, `vercel dev` and Preview deployments get null, so Clarity never loads there.

module.exports = function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ projectId: null });
  }

  const id = (process.env.CLARITY_PROJECT_ID || '').trim();
  const isProduction = process.env.VERCEL_ENV === 'production';
  const projectId = isProduction && /^[a-z0-9]+$/i.test(id) ? id : null;

  // Cached at the edge per deployment; a new deploy (or env change + redeploy) refreshes it.
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=86400, stale-while-revalidate=86400');
  return res.status(200).json({ projectId });
};
