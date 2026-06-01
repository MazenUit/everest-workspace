export type CliLevel = 1 | 2 | 'compare';

export function parseCliLevel(arg: string | undefined): CliLevel | null {
  if (arg === '1' || arg === 'level1' || arg === 'level-1') return 1;
  if (arg === '2' || arg === 'level2' || arg === 'level-2') return 2;
  if (arg === 'compare' || arg === '3' || arg === 'level-compare') return 'compare';
  return null;
}
