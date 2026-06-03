// Design tokens — single source of truth for all colors in the app.
// Dark theme inspired by AutoSleep's clean dark UI.
export const Colors = {
  background: '#0A0A0F',
  surface: '#13131A',
  surfaceElevated: '#1C1C26',
  border: '#2A2A38',

  primary: '#7C6AF7',      // purple — XP, levels, primary actions
  primaryLight: '#9D8FF9',
  success: '#4ECCA3',      // green — completed goals, streaks
  warning: '#F5A623',      // orange — grace day, caution
  danger: '#F25F5C',       // red — missed streaks

  text: '#FFFFFF',
  textSecondary: '#8888A8',
  textMuted: '#55556A',

  // Category colors for goal rings
  categories: {
    health: '#4ECCA3',
    career: '#7C6AF7',
    social: '#F5A623',
    hobbies: '#F25F5C',
    learning: '#56CCF2',
    mental_health: '#BB86FC',
    money: '#FFD700',
    custom: '#8888A8',
  },
} as const;
