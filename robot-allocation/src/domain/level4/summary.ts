import { ClientAllocation } from '../allocation-types';
import { RobotCategory, ROBOT_CATEGORIES, ROBOT_SPECS } from '../robots';
import { hoursForAssignment } from '../shared/assignment-helpers';

export type AllocationSummary = {
  totalRobotsUsed: number;
  totalChargingCost: number;
  avgUtilizationPct: number;
  categoryUtilizationPct: Record<RobotCategory, number>;
};

export function buildSummary(allocations: ClientAllocation[]): AllocationSummary {
  let totalRobotsUsed = 0;
  let totalChargingCost = 0;
  let totalHoursRequested = 0;
  let totalHoursProvided = 0;
  const robotsPerCategory: Record<RobotCategory, number> = { Bravo: 0, Charlie: 0, Delta: 0 };

  for (const allocation of allocations) {
    const assignment = allocation.servedByActive ? allocation.assignment : allocation.standbyAssignment;
    const cost = allocation.servedByActive ? allocation.chargingCost : allocation.standbyCost;

    for (const cat of ROBOT_CATEGORIES) {
      robotsPerCategory[cat] += assignment[cat];
      totalRobotsUsed += assignment[cat];
    }
    totalChargingCost += cost;
    totalHoursRequested += allocation.hoursRequested;
    totalHoursProvided += hoursForAssignment(assignment);
  }

  const avgUtilizationPct =
    totalHoursProvided === 0 ? 0 : Math.round((totalHoursRequested / totalHoursProvided) * 100);

  const categoryUtilizationPct = { Bravo: 0, Charlie: 0, Delta: 0 } as Record<RobotCategory, number>;
  for (const cat of ROBOT_CATEGORIES) {
    const catHours = robotsPerCategory[cat] * ROBOT_SPECS[cat].hoursPerDay;
    categoryUtilizationPct[cat] =
      totalHoursProvided === 0 ? 0 : Math.round((catHours / totalHoursProvided) * 100);
  }

  return { totalRobotsUsed, totalChargingCost, avgUtilizationPct, categoryUtilizationPct };
}
