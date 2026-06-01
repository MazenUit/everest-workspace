// EverBot fleet. Each robot can be assigned once per allocation for up to hoursPerDay, then it recharges.

export type RobotCategory = 'Bravo' | 'Charlie' | 'Delta';

export interface RobotSpec {
  category: RobotCategory;
  hoursPerDay: number;
  chargingCostPerDay: number;
}

/** Company table — hours and charging cost per robot type */
export const ROBOT_SPECS: Record<RobotCategory, RobotSpec> = {
  Bravo: { category: 'Bravo', hoursPerDay: 3, chargingCostPerDay: 2 },
  Charlie: { category: 'Charlie', hoursPerDay: 5, chargingCostPerDay: 3 },
  Delta: { category: 'Delta', hoursPerDay: 8, chargingCostPerDay: 4 },
};

/** Order matters: index 0 < 1 < 2 for capacity and category checks */
export const ROBOT_CATEGORIES: RobotCategory[] = ['Bravo', 'Charlie', 'Delta'];
