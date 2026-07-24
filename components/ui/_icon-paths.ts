/**
 * Icon path constants, kept in a sibling file so icon.tsx does not need
 * to import the SVG renderer (avoids a circular import at module init).
 */
export type IconName =
  | 'home'
  | 'users'
  | 'play'
  | 'trophy'
  | 'user'
  | 'plus'
  | 'arrow-right'
  | 'arrow-left'
  | 'check'
  | 'x'
  | 'lock'
  | 'watch'
  | 'shield'
  | 'settings'
  | 'mail'
  | 'map-pin'
  | 'flame'
  | 'zap'
  | 'chevron-right'
  | 'chevron-down';

export const PATHS: Record<IconName, string> = {
  home: 'M3 11 L12 3 L21 11 V20 A1 1 0 0 1 20 21 H15 V14 H9 V21 H4 A1 1 0 0 1 3 20 Z',
  users:
    'M16 21 V19 A4 4 0 0 0 12 15 H5 A4 4 0 0 0 1 19 V21 M8.5 11 A4 4 0 1 0 8.5 3 A4 4 0 0 0 8.5 11 M23 21 V19 A4 4 0 0 0 19 15 M19 11 A4 4 0 1 0 19 3',
  play: 'M6 4 L20 12 L6 20 Z',
  trophy:
    'M7 4 H17 V8 A5 5 0 0 1 7 8 Z M5 4 H7 V8 A3 3 0 0 1 5 8 Z M17 4 H19 A3 3 0 0 1 19 8 H17 Z M9 14 H15 V17 H9 Z M8 21 H16 V18 H8 Z',
  user: 'M12 12 A4 4 0 1 0 12 4 A4 4 0 0 0 12 12 Z M4 21 V19 A6 6 0 0 1 10 13 H14 A6 6 0 0 1 20 19 V21',
  plus: 'M12 4 V20 M4 12 H20',
  'arrow-right': 'M4 12 H20 M14 6 L20 12 L14 18',
  'arrow-left': 'M20 12 H4 M10 6 L4 12 L10 18',
  check: 'M4 12 L10 18 L20 6',
  x: 'M5 5 L19 19 M19 5 L5 19',
  lock: 'M6 11 H18 V20 A1 1 0 0 1 17 21 H7 A1 1 0 0 1 6 20 Z M8 11 V7 A4 4 0 0 1 16 7 V11',
  watch: 'M8 3 H16 L17 7 V17 L16 21 H8 L7 17 V7 Z M9 12 H15',
  shield: 'M12 3 L20 6 V12 A8 8 0 0 1 12 21 A8 8 0 0 1 4 12 V6 Z',
  settings:
    'M12 8 A4 4 0 1 0 12 16 A4 4 0 0 0 12 8 Z M19.4 15 A1.7 1.7 0 0 0 19.7 17 L19.8 17.3 A1 1 0 0 1 19 18.8 L18.7 19 A1 1 0 0 1 17.2 18.7 L17.1 18.4 A1.7 1.7 0 0 0 15 17.1 A1.7 1.7 0 0 0 13 18.4 L12.9 18.7 A1 1 0 0 1 11.3 19 L11 18.8 A1 1 0 0 1 10.3 17.3 L10.4 17 A1.7 1.7 0 0 0 8.6 15 A1.7 1.7 0 0 0 6.3 15.3 L6.2 15.6 A1 1 0 0 1 4.6 15.9 L4.3 15.6 A1 1 0 0 1 4.6 14 L4.9 13.7 A1.7 1.7 0 0 0 6 11.3 A1.7 1.7 0 0 0 4.9 8.9 L4.6 8.6 A1 1 0 0 1 4.3 7 L4.6 6.7 A1 1 0 0 1 6.2 6.1 L6.3 6.4 A1.7 1.7 0 0 0 8.6 6.7 A1.7 1.7 0 0 0 10.4 4.7 L10.3 4.4 A1 1 0 0 1 11 2.9 L11.3 2.7 A1 1 0 0 1 12.9 3 L13 3.3 A1.7 1.7 0 0 0 15 4.7 A1.7 1.7 0 0 0 17.1 4.4 L17.2 4.1 A1 1 0 0 1 18.7 3.7 L19 3.9 A1 1 0 0 1 19.7 5.4 L19.6 5.7 A1.7 1.7 0 0 0 18 7 A1.7 1.7 0 0 0 19.6 8.9 L19.9 9.2 A1 1 0 0 1 19.7 10.7 L19.4 11 A1 1 0 0 1 17.9 11.3 L17.8 11 A1.7 1.7 0 0 0 15 11.3 A1.7 1.7 0 0 0 13.1 12.7',
  mail: 'M3 6 A1 1 0 0 1 4 5 H20 A1 1 0 0 1 21 6 V18 A1 1 0 0 1 20 19 H4 A1 1 0 0 1 3 18 Z M3 7 L12 13 L21 7',
  'map-pin':
    'M12 22 C7 16 4 12 4 9 A8 8 0 0 1 20 9 C20 12 17 16 12 22 Z M12 11 A2 2 0 1 0 12 7 A2 2 0 0 0 12 11 Z',
  flame:
    'M12 22 C7 22 4 19 4 15 C4 12 5 10 7 8 C7 11 8 12 10 12 C10 9 11 6 13 4 C13 8 16 9 16 14 C18 14 20 16 20 18 C20 21 17 22 12 22 Z',
  zap: 'M13 2 L4 14 H11 L10 22 L20 10 H13 Z',
  'chevron-right': 'M9 5 L16 12 L9 19',
  'chevron-down': 'M5 9 L12 16 L19 9',
};

export const STROKE_ICONS = new Set<IconName>([
  'plus',
  'arrow-right',
  'arrow-left',
  'check',
  'x',
  'lock',
  'chevron-right',
  'chevron-down',
]);
