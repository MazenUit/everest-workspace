import {
  AllocationResult,
  CostOptimizationResult,
} from '../allocation-types';
import { chargingCostForAssignment } from '../shared/assignment-helpers';

export type LevelCompareInput = {
  level1: AllocationResult;
  level2: CostOptimizationResult;
};

export type CompareMetrics = {
  level1ChargingCost: number;
  level2ChargingCost: number;
  costDifference: number;
};

export function buildCompareMetrics(
  input: LevelCompareInput
): CompareMetrics | null {
  const { level1, level2 } = input;
  if (!level1.ok || !level2.ok) return null;

  const level1ChargingCost = chargingCostForAssignment(level1.assignment);
  const level2ChargingCost = level2.chargingCost;

  return {
    level1ChargingCost,
    level2ChargingCost,
    costDifference: level1ChargingCost - level2ChargingCost,
  };
}
