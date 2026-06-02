export type CliLevel = 1 | 2 | 3 | 4 | 'compare';

export function parseCliLevel(arg: string | undefined): CliLevel | null {
  if (arg === '1' || arg === 'level1' || arg === 'level-1') return 1;
  if (arg === '2' || arg === 'level2' || arg === 'level-2') return 2;
  if (arg === '3' || arg === 'level3' || arg === 'level-3') return 3;
  if (arg === '4' || arg === 'level4' || arg === 'level-4') return 4;
  if (arg === 'compare' || arg === 'level-compare') return 'compare';
  return null;
}
