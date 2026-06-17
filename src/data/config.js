// All the dials in one place. Change a number here, push, redeploy.

export const STAGE_POINTS = {
  GROUP_STAGE: 5,
  LAST_32: 5,    // 2026 format adds a Round of 32 the rules don't mention; default = group exit.
  LAST_16: 10,
  QUARTER_FINALS: 20,
  SEMI_FINALS: 35,
  RUNNER_UP: 50,
  WINNER: 75,
};

export const POINTS = {
  goal: 1,
  cleanSheet: 1,
  goldenBallWin: 20,
  goldenBallTop3: 10,
  goldenBootWin: 20,
  goldenBootTop3: 10,
  goldenGlove: 15,
  bestYoungPlayer: 15,
  darkHorse: 15,
  madDog: 10,
  ghostWin: 3,    // your team beats an unallocated Ghost Rider (group stage only)
  ghostDraw: 1,
  ghostLoss: -3,
};

// Mad Dog threshold: 5 thumbs up for this comp (family one was 10).
export const MAD_DOG_THRESHOLD = 5;

// Aussie Handicap: points from these nations are doubled (including Ghost Rider results for the Aussie team, and including negative ghost results).
export const AUSSIE_NATIONS = ['Australia'];

// Ghost Rider matchups only count in the group stage. Set true to also count knockouts.
export const GHOST_KNOCKOUTS = false;

// football-data.org names -> draw names.
export const TEAM_ALIASES = {
  'South Korea': 'Korea Republic',
  'Korea Republic': 'Korea Republic',
  'USA': 'USA',
  'United States': 'USA',
  'United States of America': 'USA',
  'Turkey': 'Türkiye',
  'Türkiye': 'Türkiye',
  'Ivory Coast': "Côte d'Ivoire",
  'Czech Republic': 'Czechia',
  'Bosnia and Herzegovina': 'Bosnia & Herzegovina',
  'Bosnia-Herzegovina': 'Bosnia & Herzegovina',
  'Democratic Republic of the Congo': 'DR Congo',
  'Congo DR': 'DR Congo',
  'DR Congo': 'DR Congo',
  'Cabo Verde': 'Cape Verde',
  'Cape Verde Islands': 'Cape Verde',
};

// API player name -> draw player name. The Debug panel lists unmatched scorers.
export const PLAYER_ALIASES = {
  'Nestor Irankunda': 'Nestory Irankunda',
};
