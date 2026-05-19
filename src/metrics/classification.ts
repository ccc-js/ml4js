import type { Vector } from '../base.js';
import { Ml4jsError } from '../errors.js';

function assertBinaryVectors(actual: Vector, predicted: Vector): void {
  if (actual.length === 0 || predicted.length === 0) {
    throw new Ml4jsError('Metric inputs must not be empty.');
  }

  if (actual.length !== predicted.length) {
    throw new Ml4jsError('Metric inputs must have the same length.');
  }
}

export function accuracyScore(actual: Vector, predicted: Vector): number {
  assertBinaryVectors(actual, predicted);
  const correct = actual.reduce(
    (sum, value, index) => sum + (value === predicted[index] ? 1 : 0),
    0
  );
  return correct / actual.length;
}

export function precisionScore(actual: Vector, predicted: Vector): number {
  assertBinaryVectors(actual, predicted);
  let truePositive = 0;
  let falsePositive = 0;

  for (let index = 0; index < actual.length; index += 1) {
    if (predicted[index] === 1) {
      if (actual[index] === 1) {
        truePositive += 1;
      } else {
        falsePositive += 1;
      }
    }
  }

  return truePositive + falsePositive === 0
    ? 0
    : truePositive / (truePositive + falsePositive);
}

export function recallScore(actual: Vector, predicted: Vector): number {
  assertBinaryVectors(actual, predicted);
  let truePositive = 0;
  let falseNegative = 0;

  for (let index = 0; index < actual.length; index += 1) {
    if (actual[index] === 1) {
      if (predicted[index] === 1) {
        truePositive += 1;
      } else {
        falseNegative += 1;
      }
    }
  }

  return truePositive + falseNegative === 0
    ? 0
    : truePositive / (truePositive + falseNegative);
}
