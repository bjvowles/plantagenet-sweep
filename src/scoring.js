import { DRAW, GHOST_RIDERS } from './data/draw.js';
import {
  STAGE_POINTS, POINTS, AUSSIE_NATIONS, TEAM_ALIASES, PLAYER_ALIASES, GHOST_KNOCKOUTS,
  MATCH_RESULT_POINTS, AUSSIE_DOUBLES_MATCH_POINTS,
} from './data/config.js';
import { AWARDS, MAD_DOG, ADJUSTMENTS, CLEAN_SHEET_OVERRIDES } from './data/manual.js';

export function norm(s) {
  return (s || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u2010-\u2015]/g, '-')
    .replace(/[.''`]/g, '')
    .toLowerCase().trim();
}
function nameKey(s) { return norm(s).split(/[\s-]+/).filter(Boolean).sort().join('|'); }
function teamKey(apiName) { return norm(TEAM_ALIASES[apiName] || apiName); }
const isAussie = (n) => AUSSIE_NATIONS.map(norm).includes(norm(n));

const STAGE_ORDER = ['GROUP_STAGE', 'LAST_32', 'LAST_16', 'QUARTER_FINALS', 'SEMI_FINALS', 'THIRD_PLACE', 'FINAL'];
const STAGE_LABELS = { GROUP_STAGE: 'Group stage', LAST_32: 'Round of 32', LAST_16: 'Round of 16', QUARTER_FINALS: 'Quarter final exit' };

function teamProgress(teamName, matches) {
  const key = norm(teamName);
  const mine = matches.filter((m) => teamKey(m.home.name) === key || teamKey(m.away.name) === key);
  if (mine.length === 0) return { points: 0, label: 'No matches found — check team name', found: false };

  const finalMatch = mine.find((m) => m.stage === 'FINAL');
  const thirdMatch = mine.find((m) => m.stage === 'THIRD_PLACE');

  // 1. Final finished
  if (finalMatch?.status === 'FINISHED' && finalMatch.winner) {
    const homeIsMine = teamKey(finalMatch.home.name) === key;
    const won = (finalMatch.winner === 'HOME_TEAM' && homeIsMine) || (finalMatch.winner === 'AWAY_TEAM' && !homeIsMine);
    return won
      ? { points: STAGE_POINTS.WINNER, label: 'WORLD CUP WINNER', found: true }
      : { points: STAGE_POINTS.RUNNER_UP, label: 'Runner up', found: true };
  }
  // 2. Third-place playoff finished
  if (thirdMatch?.status === 'FINISHED' && thirdMatch.winner) {
    const homeIsMine = teamKey(thirdMatch.home.name) === key;
    const won = (thirdMatch.winner === 'HOME_TEAM' && homeIsMine) || (thirdMatch.winner === 'AWAY_TEAM' && !homeIsMine);
    return won
      ? { points: STAGE_POINTS.THIRD, label: '3rd place', found: true }
      : { points: STAGE_POINTS.FOURTH, label: '4th place', found: true };
  }
  // 3. Final exists but not finished
  if (finalMatch) return { points: STAGE_POINTS.RUNNER_UP, label: 'Reached the final', found: true };
  // 4. Semi-finalist awaiting playoff resolution
  if (mine.some((m) => m.stage === 'SEMI_FINALS' || m.stage === 'THIRD_PLACE')) {
    return { points: STAGE_POINTS.SEMI_FINALIST, label: 'Semi-finalist', found: true };
  }
  // 5. Exit by furthest round reached
  let best = 'GROUP_STAGE';
  for (const m of mine) {
    if (STAGE_ORDER.indexOf(m.stage) > STAGE_ORDER.indexOf(best)) best = m.stage;
  }
  return { points: STAGE_POINTS[best] ?? 0, label: STAGE_LABELS[best] || best, found: true };
}

// Ghost Rider results for one of a person's teams.
function ghostResults(teamName, matches) {
  const key = norm(teamName);
  const ghostKeys = GHOST_RIDERS.map(norm);
  const out = [];
  for (const m of matches) {
    if (m.status !== 'FINISHED') continue;
    if (!GHOST_KNOCKOUTS && m.stage !== 'GROUP_STAGE') continue;
    const homeIsMine = teamKey(m.home.name) === key;
    const awayIsMine = teamKey(m.away.name) === key;
    if (!homeIsMine && !awayIsMine) continue;
    const oppKey = homeIsMine ? teamKey(m.away.name) : teamKey(m.home.name);
    if (!ghostKeys.includes(oppKey)) continue;
    const oppName = homeIsMine ? m.away.name : m.home.name;
    let result, pts;
    if (m.winner === 'DRAW') { result = 'draw'; pts = POINTS.ghostDraw; }
    else if ((m.winner === 'HOME_TEAM' && homeIsMine) || (m.winner === 'AWAY_TEAM' && awayIsMine)) { result = 'win'; pts = POINTS.ghostWin; }
    else { result = 'loss'; pts = POINTS.ghostLoss; }
    out.push({ opp: oppName, result, pts });
  }
  return out;
}

function matchResultPoints(teamName, matches) {
  const key = norm(teamName);
  const out = [];
  for (const m of matches) {
    if (m.status !== 'FINISHED') continue;
    const homeIsMine = teamKey(m.home.name) === key;
    const awayIsMine = teamKey(m.away.name) === key;
    if (!homeIsMine && !awayIsMine) continue;
    const isPenalties = m.duration === 'PENALTY_SHOOTOUT';
    let result, pts;
    if (isPenalties || m.winner === 'DRAW') {
      result = 'draw'; pts = POINTS.matchDraw;
    } else if ((m.winner === 'HOME_TEAM' && homeIsMine) || (m.winner === 'AWAY_TEAM' && awayIsMine)) {
      result = 'win'; pts = POINTS.matchWin;
    } else {
      result = 'loss'; pts = POINTS.matchLoss;
    }
    out.push({ stage: m.stage, opp: homeIsMine ? m.away.name : m.home.name, result, pts });
  }
  return out;
}

export function computeLeaderboard(apiData) {
  const matches = apiData?.matches || [];
  const scorers = apiData?.scorers || [];
  const finished = matches.filter((m) => m.status === 'FINISHED');

  const goalsByPlayer = new Map();
  for (const s of scorers) {
    const aliased = PLAYER_ALIASES[s.player] || s.player;
    goalsByPlayer.set(nameKey(aliased), { goals: s.goals });
  }

  const cleanSheetsByNation = new Map();
  for (const m of finished) {
    if (m.fullTime.home === null || m.fullTime.away === null) continue;
    if (m.fullTime.away === 0) { const k = teamKey(m.home.name); cleanSheetsByNation.set(k, (cleanSheetsByNation.get(k) || 0) + 1); }
    if (m.fullTime.home === 0) { const k = teamKey(m.away.name); cleanSheetsByNation.set(k, (cleanSheetsByNation.get(k) || 0) + 1); }
  }

  const matchedScorerKeys = new Set();

  const rows = DRAW.map((p) => {
    const items = [];
    const bottom = (p.bottomSeeds || []).map(norm);

    for (const t of p.teams) {
      const prog = teamProgress(t, matches);
      const aussie = isAussie(t);
      let pts = prog.points * (aussie ? 2 : 1);
      items.push({ kind: 'team', label: t, detail: prog.label + (aussie && pts > 0 ? ' · AUSSIE 2×' : ''), points: pts, warn: !prog.found });

      if (bottom.includes(norm(t)) && prog.points >= STAGE_POINTS.QUARTER_FINALS) {
        items.push({ kind: 'bonus', label: `Dark Horse — ${t}`, detail: 'Bottom-24 seed made the quarters', points: POINTS.darkHorse });
      }

      // Match result points (win 3 / draw 1 / loss 0)
      if (MATCH_RESULT_POINTS) {
        for (const mr of matchResultPoints(t, finished)) {
          if (mr.pts === 0) continue;
          const doubleIt = aussie && AUSSIE_DOUBLES_MATCH_POINTS;
          const pts = mr.pts * (doubleIt ? 2 : 1);
          items.push({ kind: 'match', label: `${t} vs ${mr.opp}`, detail: `Match ${mr.result}${doubleIt ? ' · AUSSIE 2×' : ''}`, points: pts });
        }
      }

      // Ghost Rider matchups for this team
      for (const g of ghostResults(t, matches)) {
        const base = g.pts;
        const ghostPts = base * (aussie ? 2 : 1);
        const sign = g.result === 'win' ? 'beat' : g.result === 'draw' ? 'drew with' : 'lost to';
        items.push({ kind: 'ghost', label: `${t} ${sign} ${g.opp}`, detail: `Ghost Rider ${g.result}${aussie ? ' · AUSSIE 2×' : ''}`, points: ghostPts });
      }
    }

    for (const pl of p.players) {
      const hit = goalsByPlayer.get(nameKey(pl.name));
      const goals = hit?.goals || 0;
      if (hit) matchedScorerKeys.add(nameKey(pl.name));
      const aussie = isAussie(pl.nation);
      items.push({ kind: 'player', label: pl.name, detail: `${goals} goal${goals === 1 ? '' : 's'}${aussie && goals > 0 ? ' · AUSSIE 2×' : ''}`, points: goals * POINTS.goal * (aussie ? 2 : 1) });

      const award = (won, top3, winPts, top3Pts, awardName) => {
        if (won && norm(won) === norm(pl.name)) items.push({ kind: 'award', label: `${awardName} — ${pl.name}`, detail: aussie ? 'AUSSIE 2×' : '', points: winPts * (aussie ? 2 : 1) });
        else if ((top3 || []).some((n) => norm(n) === norm(pl.name))) items.push({ kind: 'award', label: `${awardName} top 3 — ${pl.name}`, detail: aussie ? 'AUSSIE 2×' : '', points: top3Pts * (aussie ? 2 : 1) });
      };
      award(AWARDS.goldenBall.winner, AWARDS.goldenBall.top3, POINTS.goldenBallWin, POINTS.goldenBallTop3, 'Golden Ball');
      award(AWARDS.goldenBoot.winner, AWARDS.goldenBoot.top3, POINTS.goldenBootWin, POINTS.goldenBootTop3, 'Golden Boot');
      if (AWARDS.bestYoungPlayer.winner && norm(AWARDS.bestYoungPlayer.winner) === norm(pl.name)) {
        items.push({ kind: 'award', label: `Best Young Player — ${pl.name}`, detail: aussie ? 'AUSSIE 2×' : '', points: POINTS.bestYoungPlayer * (aussie ? 2 : 1) });
      }
    }

    for (const k of p.keepers) {
      const aussie = isAussie(k.nation);
      const override = CLEAN_SHEET_OVERRIDES[k.name];
      const sheets = override !== undefined ? override : (cleanSheetsByNation.get(norm(k.nation)) || 0);
      items.push({ kind: 'keeper', label: k.name, detail: `${sheets} clean sheet${sheets === 1 ? '' : 's'}${override !== undefined ? ' (manual)' : ''}${aussie && sheets > 0 ? ' · AUSSIE 2×' : ''}`, points: sheets * POINTS.cleanSheet * (aussie ? 2 : 1) });
      if (AWARDS.goldenGlove.winner && norm(AWARDS.goldenGlove.winner) === norm(k.name)) {
        items.push({ kind: 'award', label: `Golden Glove — ${k.name}`, detail: aussie ? 'AUSSIE 2×' : '', points: POINTS.goldenGlove * (aussie ? 2 : 1) });
      }
    }

    for (const md of MAD_DOG.filter((m) => norm(m.participant) === norm(p.name))) items.push({ kind: 'bonus', label: 'Mad Dog Celebration', detail: md.note || '', points: POINTS.madDog });
    for (const adj of ADJUSTMENTS.filter((a) => norm(a.participant) === norm(p.name))) items.push({ kind: 'bonus', label: 'Adjustment', detail: adj.note || '', points: adj.points });

    const total = items.reduce((s, i) => s + i.points, 0);
    return { name: p.name, items, total };
  });

  rows.sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));
  rows.forEach((r, i) => { r.rank = i + 1; });

  const unmatchedScorers = scorers
    .filter((s) => !matchedScorerKeys.has(nameKey(PLAYER_ALIASES[s.player] || s.player)))
    .map((s) => `${s.player} (${s.team}) — ${s.goals}`);

  return { rows, unmatchedScorers };
}
