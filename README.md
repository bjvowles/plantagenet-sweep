# The Work Sweep — Plantagenet Medical · World Cup 2026

Live leaderboard for the Plantagenet Medical sweep. Auto-scores team progression,
goals, clean sheets, and Ghost Rider matchups from football-data.org. Awards and
Mad Dog points are manual edits.

10 entrants · 4 teams / 2 keepers / 5 players each · $50 pool.

## What's different from a standard sweep

- **Ghost Riders**: 8 unallocated teams. When your team plays one in the GROUP STAGE,
  win +3 / draw +1 / loss -3. Listed in `src/data/draw.js` (GHOST_RIDERS).
  Knockouts are excluded by default — flip GHOST_KNOCKOUTS in config.js to include them.
- **Aussie Handicap** doubles everything Australian, including Ghost Rider results
  (an Aussie loss to a ghost is -6).
- **Mad Dog** threshold is 5 thumbs up (set in config.js).

## Deploy free (Cloudflare Pages — allows commercial use)

Vercel's free tier is non-commercial only, so for a workplace comp use Cloudflare Pages:

1. Push this folder to a GitHub repo.
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → pick the repo.
3. Build settings: Framework preset **Vite**, build command `npm run build`, output dir `dist`.
4. Add environment variable `FOOTBALL_DATA_TOKEN` = the token from the football-data.org email.
5. The `/api/worldcup` function runs as a Pages Function automatically (see api/ folder).
6. Deploy. Share the URL.

(If you'd rather use Vercel anyway, the api/worldcup.js function works there too — same as the family app.)

## Admin (all in src/data/manual.js)

- AWARDS — fill in after the final (Golden Ball/Boot/Glove, Best Young Player).
- MAD_DOG — add an entry when a video hits 5 thumbs up.
- ADJUSTMENTS — committee rulings, +/- with a note.
- CLEAN_SHEET_OVERRIDES — only if a backup keeper played.

Dials in src/data/config.js: AUSSIE_NATIONS, STAGE_POINTS (incl. Round of 32),
ghost point values, TEAM_ALIASES / PLAYER_ALIASES for name mismatches.

Edit → commit → push → live in ~60 seconds.
