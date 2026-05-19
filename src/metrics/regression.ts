import { Ml4jsError } from '../errors.js';
import type { Vector } from '../base.js';

function assertSameLength(actual: Vector, predicted: Vector): void {
  if (actual.length === 0 || predicted.length === 0) {
    throw new Ml4jsError('Metric inputs must not be empty.');
  }

  if (actual.length !== predicted.length) {
    throw new Ml4jsError('Metric inputs must have the same length.');
  }
}

export function meanSquaredError(actual: Vector, predicted: Vector): number {
  assertSameLength(actual, predicted);
  const total = actual.reduce(
    (sum, value, index) => sum + (value - predicted[index]!) ** 2,
    0
  );
  return total / actual.length;
}

export function meanAbsoluteError(actual: Vector, predicted: Vector): number {
  assertSameLength(actual, predicted);
  const total = actual.reduce(
    (sum, value, index) => sum + Math.abs(value - predicted[index]!),
    0
  );
  return total / actual.length;
}

export function r2Score(actual: Vector, predicted: Vector): number {
  assertSameLength(actual, predicted);
  const mean = actual.reduce((sum, value) => sum + value, 0) / actual.length;
  const totalSumOfSquares = actual.reduce(
    (sum, value) => sum + (value - mean) ** 2,
    0
  );
  if (totalSumOfSquares === 0) {
    return 1;
  }

  const residualSumOfSquares = actual.reduce(
    (sum, value, index) => sum + (value - predicted[index]!) ** 2,
    0
  );
  return 1 - residualSumOfSquares / totalSumOfSquares;
}
