import { RobotAssignment, RobotInventory } from '../allocation-types';

export function eachPossibleMix(stock: RobotInventory): RobotAssignment[] {
  const mixes: RobotAssignment[] = [];

  for (let b = 0; b <= stock.Bravo; b++) {
    for (let c = 0; c <= stock.Charlie; c++) {
      for (let d = 0; d <= stock.Delta; d++) {
        if (b + c + d > 0) {
          mixes.push({ Bravo: b, Charlie: c, Delta: d });
        }
      }
    }
  }

  return mixes;
}
