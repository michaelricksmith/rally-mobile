/**
 * Rally design tokens. The single source of truth for color, type, spacing,
 * radii, and motion. Every screen and component reads from here.
 *
 * Direction: hybrid of "Sports Club" (social-first, group-tinted accents,
 * Manrope, Lucide) and "Athletic Editorial" (Geist Mono for scoreboard
 * numbers, tight hierarchy).
 *
 * Conventions:
 *  - All colors are written as `#RRGGBB` strings. `StyleSheet` and inline
 *    styles both accept these. `process.env` is never read here.
 *  - Spacing follows a 4 px scale. 0..12 are explicit; 13..31 step by 4.
 *  - Radii are intentionally small (max 14). No "bubble" cards.
 *  - Group accent colors are six carefully chosen hues, used as controlled
 *    accents. The app background and typography are constant.
 */

export const palette = {
  // Surfaces
  inkDeep: '#0B0D10', // global background
  ink: '#10131A', // raised surface
  inkRaised: '#161A22', // overlay / card fill
  inkHover: '#1D222C', // pressed state
  hairline: 'rgba(255,255,255,0.08)', // 1 px borders
  divider: 'rgba(255,255,255,0.05)',
  scrim: 'rgba(0,0,0,0.6)',

  // Text
  text: '#F4F5F7', // primary copy
  textMuted: '#A3A8B3', // secondary
  textDim: '#6B7280', // tertiary, captions
  textInverse: '#0B0D10', // for use on bright accent fills

  // Status (used sparingly)
  success: '#22C55E',
  warn: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
  live: '#FF4D6D', // active-session pulse

  // Six group accent colors. Each is a single, saturated, modern hue.
  // A group picks one; it tints the active tab, leaderboard rank
  // movement, group header, session indicator, challenge progress.
  group: {
    lime: '#D7FF3C', // default for new groups
    ember: '#FF6B35',
    cyan: '#22D3EE',
    violet: '#A78BFA',
    magenta: '#F472B6',
    gold: '#FACC15',
  } as const,
} as const;

export type GroupAccent = keyof typeof palette.group;
export const GROUP_ACCENTS: GroupAccent[] = ['lime', 'ember', 'cyan', 'violet', 'magenta', 'gold'];

/** Resolve a group accent to its hex. */
export function accent(accent: GroupAccent | undefined | null): string {
  if (!accent) return palette.group.lime;
  return palette.group[accent] ?? palette.group.lime;
}

/**
 * Type scale. Manrope is the primary face (display + body).
 * Geist Mono is reserved for numeric data (points, ranks, timers).
 *
 * On web we fall back to system-ui; native uses Manrope via @expo-google-fonts
 * (fonts are loaded at boot in app/_layout.tsx, Phase 1). For Phase 0 web,
 * we ship system-ui so the redesign does not require font asset hosting.
 */
export const type = {
  fontDisplay: 'Manrope, system-ui, -apple-system, "Segoe UI", sans-serif',
  fontBody: 'Manrope, system-ui, -apple-system, "Segoe UI", sans-serif',
  fontMono: '"Geist Mono", "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',

  // Display (hero / page titles)
  display1: {
    fontFamily: 'Manrope, system-ui, sans-serif',
    fontSize: 44,
    lineHeight: 48,
    fontWeight: '800' as const,
    letterSpacing: -1.2,
  },
  display2: {
    fontFamily: 'Manrope, system-ui, sans-serif',
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800' as const,
    letterSpacing: -0.8,
  },

  // Headlines (section titles)
  h1: {
    fontFamily: 'Manrope, system-ui, sans-serif',
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '700' as const,
    letterSpacing: -0.4,
  },
  h2: {
    fontFamily: 'Manrope, system-ui, sans-serif',
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700' as const,
    letterSpacing: -0.2,
  },
  h3: {
    fontFamily: 'Manrope, system-ui, sans-serif',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600' as const,
  },

  // Body
  body: {
    fontFamily: 'Manrope, system-ui, sans-serif',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400' as const,
  },
  bodyStrong: {
    fontFamily: 'Manrope, system-ui, sans-serif',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600' as const,
  },
  small: {
    fontFamily: 'Manrope, system-ui, sans-serif',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400' as const,
  },
  caption: {
    fontFamily: 'Manrope, system-ui, sans-serif',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
    letterSpacing: 0.2,
  },
  overline: {
    fontFamily: 'Manrope, system-ui, sans-serif',
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700' as const,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
  },

  // Scoreboard (numeric data only)
  score1: {
    fontFamily: '"Geist Mono", "JetBrains Mono", ui-monospace, monospace',
    fontSize: 48,
    lineHeight: 52,
    fontWeight: '700' as const,
    letterSpacing: -1.0,
  },
  score2: {
    fontFamily: '"Geist Mono", "JetBrains Mono", ui-monospace, monospace',
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '700' as const,
    letterSpacing: -0.6,
  },
  score3: {
    fontFamily: '"Geist Mono", "JetBrains Mono", ui-monospace, monospace',
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
  },
  score4: {
    fontFamily: '"Geist Mono", "JetBrains Mono", ui-monospace, monospace',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600' as const,
    letterSpacing: 0,
  },
} as const;

/** 4 px spacing scale. */
export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  massive: 56,
} as const;

/** Small radii. No "bubble" cards. */
export const radius = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 10,
  xl: 14,
  pill: 999,
} as const;

/** Hairline borders. */
export const hairlineWidth = 1;

/** Subtle shadow, used only when true separation is needed. */
export const shadow = {
  none: undefined,
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 1,
  },
  raised: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 4,
  },
} as const;

/** Motion timings. */
export const motion = {
  fast: 120,
  base: 200,
  slow: 320,
} as const;

/** The default group accent for new groups and ungrouped views. */
export const DEFAULT_GROUP_ACCENT: GroupAccent = 'lime';
