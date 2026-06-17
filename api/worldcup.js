// Vercel serverless function.
// Proxies football-data.org so the API token never reaches the browser,
// and caches aggressively so 24 family members don't torch the 10 req/min limit.

let memCache = { data: null, ts: 0 };
const TTL_MS = 5 * 60 * 1000; // 5 minutes

const BASE = 'https://api.football-data.org/v4/competitions/WC';

async function fdFetch(path, token) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'X-Auth-Token': token },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`football-data.org ${res.status} on ${path}: ${body.slice(0, 200)}`);
  }
  return res.json();
}

export default async function handler(req, res) {
  const token = process.env.FOOTBALL_DATA_TOKEN;
  if (!token) {
    res.status(500).json({ error: 'FOOTBALL_DATA_TOKEN env var not set in Vercel.' });
    return;
  }

  // CDN cache: Vercel edge serves repeat hits without invoking this function.
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=900');

  const now = Date.now();
  if (memCache.data && now - memCache.ts < TTL_MS) {
    res.status(200).json(memCache.data);
    return;
  }

  try {
    const [matches, scorers] = await Promise.all([
      fdFetch('/matches', token),
      fdFetch('/scorers?limit=200', token),
    ]);

    const payload = {
      fetchedAt: new Date().toISOString(),
      matches: (matches.matches || []).map((m) => ({
        id: m.id,
        stage: m.stage,
        status: m.status,
        utcDate: m.utcDate,
        home: { id: m.homeTeam?.id, name: m.homeTeam?.name, tla: m.homeTeam?.tla },
        away: { id: m.awayTeam?.id, name: m.awayTeam?.name, tla: m.awayTeam?.tla },
        winner: m.score?.winner || null,
        fullTime: m.score?.fullTime || { home: null, away: null },
      })),
      scorers: (scorers.scorers || []).map((s) => ({
        player: s.player?.name,
        team: s.team?.name,
        tla: s.team?.tla,
        goals: s.goals ?? 0,
        penalties: s.penalties ?? 0,
      })),
    };

    memCache = { data: payload, ts: now };
    res.status(200).json(payload);
  } catch (err) {
    // Serve stale data rather than a dead leaderboard if upstream hiccups.
    if (memCache.data) {
      res.status(200).json({ ...memCache.data, stale: true, error: String(err) });
      return;
    }
    res.status(502).json({ error: String(err) });
  }
}
