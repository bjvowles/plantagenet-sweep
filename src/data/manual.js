// THE ADMIN PANEL IS THIS FILE. Edit, push, redeploy in ~60 seconds.

// End-of-tournament awards. Names must match draw names (src/data/draw.js).
export const AWARDS = {
  goldenBall: { winner: null, top3: [] },
  goldenBoot: { winner: null, top3: [] },
  goldenGlove: { winner: null },
  bestYoungPlayer: { winner: null },
};

// Mad Dog Celebration points. 5 thumbs up in the group chat = entry here.
export const MAD_DOG = [
  // { participant: 'Nathan', note: 'Shoey in the tearoom' },
];

// Catch-all manual adjustments (positive or negative), reason shown in the app.
export const ADJUSTMENTS = [
  // { participant: 'Alice', points: 5, note: 'Committee discretion' },
];

// Clean sheets auto-count as "keeper's nation conceded 0 in a finished match".
// Override here with the TRUE count if a backup keeper played instead.
export const CLEAN_SHEET_OVERRIDES = {
  // 'Jordan Pickford': 2,
};
