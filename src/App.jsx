import React, { useEffect, useMemo, useState } from 'react';
import { computeLeaderboard } from './scoring.js';

const PRIZES = ['$35', '$15', 'cake🍰'];

function timeAgo(iso) {
  if (!iso) return '';
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  return `${Math.round(mins / 60)} hr ago`;
}

function Row({ row, isLast, open, onToggle }) {
  const medal = row.rank <= 3 ? ['🥇', '🥈', '🥉'][row.rank - 1] : null;
  return (
    <div className={`row ${row.rank === 1 ? 'leader' : ''} ${isLast ? 'shitkicker' : ''}`}>
      <button className="row-head" onClick={onToggle} aria-expanded={open}>
        <span className="rank">{medal || row.rank}</span>
        <span className="who">
          {row.name}
          {row.rank <= 3 && <span className="prize">{PRIZES[row.rank - 1]}</span>}
          {isLast && <span className="shame">💩 you bring the cake</span>}
        </span>
        <span className="pts">{row.total}</span>
        <span className={`chev ${open ? 'open' : ''}`}>▾</span>
      </button>
      {open && (
        <div className="breakdown">
          {row.items.map((it, i) => (
            <div className={`item ${it.points > 0 ? 'scored' : ''} ${it.points < 0 ? 'negative' : ''} ${it.warn ? 'warn' : ''}`} key={i}>
              <span className={`tag tag-${it.kind}`}>{{ team: 'TEAM', player: 'PLAYER', keeper: 'KEEPER', award: 'AWARD', bonus: 'BONUS', ghost: 'GHOST' }[it.kind]}</span>
              <span className="item-label">{it.label}</span>
              <span className="item-detail">{it.detail}</span>
              <span className="item-pts">{it.points > 0 ? `+${it.points}` : it.points}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Rules() {
  return (
    <div className="rules">
      <h2>How you score</h2>
      <p className="rules-note">$5 a head. 10 entrants. $50 in the pot. You hold 4 teams, 2 keepers and 5 players. Points update automatically from match results — awards get entered when FIFA hands them out.</p>
      <table>
        <tbody>
          <tr><td>Group stage exit (incl. Round of 32 exit)</td><td>5</td></tr>
          <tr><td>Round of 16</td><td>10</td></tr>
          <tr><td>Quarter final</td><td>20</td></tr>
          <tr><td>Semi final</td><td>35</td></tr>
          <tr><td>Runner up</td><td>50</td></tr>
          <tr><td>World Cup winner</td><td>75</td></tr>
          <tr><td>Goal by your player</td><td>1 each</td></tr>
          <tr><td>Clean sheet by your keeper</td><td>1 each</td></tr>
          <tr><td>Golden Ball / Golden Boot win</td><td>20</td></tr>
          <tr><td>Golden Ball / Golden Boot top 3</td><td>10</td></tr>
          <tr><td>Golden Glove</td><td>15</td></tr>
          <tr><td>Best Young Player</td><td>15</td></tr>
          <tr><td>Dark Horse — bottom-24 seed makes the quarters</td><td>15</td></tr>
          <tr><td>Mad Dog Celebration (5 thumbs up in the group)</td><td>10</td></tr>
        </tbody>
      </table>
      <div className="aussie-box">
        <strong>GHOST RIDERS 👻</strong> 8 teams are unallocated. When one of your teams plays a Ghost Rider in the group stage: win <strong>+3</strong>, draw <strong>+1</strong>, loss <strong>−3</strong>. Ghosts: Ecuador, Iran, Türkiye, Norway, Curaçao, Sweden, Iraq, Panama.
      </div>
      <div className="aussie-box">
        <strong>THE AUSSIE HANDICAP 🇦🇺</strong> Anything Australian scores DOUBLE — team progression, goals, awards, clean sheets, and Ghost Rider results (the bad ones too: an Aussie loss to a ghost is −6).
      </div>
      <p className="rules-note">Prizes: 🥇 $35 · 🥈 $15 · 🥉 a handshake 🤝 · Last place wins the Shit Kicker Award and brings in a nice chocolate cake for the team 🍰</p>
    </div>
  );
}

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [view, setView] = useState('ladder');
  const [openRow, setOpenRow] = useState(null);

  const load = () => {
    setError(null);
    fetch('/api/worldcup')
      .then((r) => (r.ok ? r.json() : r.json().then((b) => Promise.reject(b.error || r.status))))
      .then(setData)
      .catch((e) => setError(String(e)));
  };
  useEffect(load, []);

  const board = useMemo(() => (data ? computeLeaderboard(data) : null), [data]);

  return (
    <div className="app">
      <header>
        <div className="eyebrow">PLANTAGENET MEDICAL · FIFA WORLD CUP 2026</div>
        <h1>THE WORK SWEEP</h1>
        <div className="subline">
          <span>$50 pot</span><span className="dot">·</span><span>10 desperados</span><span className="dot">·</span>
          <span>{data ? `updated ${timeAgo(data.fetchedAt)}` : 'loading…'}</span>
        </div>
        <nav>
          <button className={view === 'ladder' ? 'on' : ''} onClick={() => setView('ladder')}>Ladder</button>
          <button className={view === 'rules' ? 'on' : ''} onClick={() => setView('rules')}>Rules</button>
        </nav>
      </header>

      {error && (
        <div className="error">
          Couldn't get scores: {error} <button onClick={load}>Try again</button>
        </div>
      )}

      {view === 'ladder' && board && (
        <main>
          {board.rows.map((row, i) => (
            <Row
              key={row.name}
              row={row}
              isLast={i === board.rows.length - 1}
              open={openRow === row.name}
              onToggle={() => setOpenRow(openRow === row.name ? null : row.name)}
            />
          ))}
          {board.unmatchedScorers.length > 0 && (
            <details className="debug">
              <summary>Scorer name check ({board.unmatchedScorers.length} unallocated)</summary>
              <p>Tournament scorers not matched to anyone's picks. If one of these SHOULD be someone's player, the API spells the name differently — add it to PLAYER_ALIASES in config.js.</p>
              <ul>{board.unmatchedScorers.map((s, i) => <li key={i}>{s}</li>)}</ul>
            </details>
          )}
        </main>
      )}

      {view === 'ladder' && !board && !error && <main className="loading">Warming up the scoreboard…</main>}
      {view === 'rules' && <main><Rules /></main>}

      <footer>Scores via football-data.org · Refreshes every 5 minutes · Disputes go to the rules committee (no appeals)</footer>
    </div>
  );
}
