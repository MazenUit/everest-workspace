// everBot fleet — each physical robot works up to hoursPerDay, then recharges

export type RobotCategory = 'Bravo' | 'Charlie' | 'Delta';

export interface RobotSpec {
  category: RobotCategory;
  hoursPerDay: number;
  chargingCostPerDay: number;
}

/** company table: hours and $/day per type */
export const ROBOT_SPECS: Record<RobotCategory, RobotSpec> = {
  Bravo: { category: 'Bravo', hoursPerDay: 3, chargingCostPerDay: 2 },
  Charlie: { category: 'Charlie', hoursPerDay: 5, chargingCostPerDay: 3 },
  Delta: { category: 'Delta', hoursPerDay: 8, chargingCostPerDay: 4 },
};

/** order matters: Bravo (0) < Charlie (1) < Delta (2) for level 1 checks */
export const ROBOT_CATEGORIES: RobotCategory[] = ['Bravo', 'Charlie', 'Delta'];
