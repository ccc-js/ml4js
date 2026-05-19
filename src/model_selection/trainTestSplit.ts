import type { Matrix, TrainTestSplitResult, Vector } from '../base.js';
import { Ml4jsError } from '../errors.js';
import { assertMatchingSamples } from '../math/matrix.js';
import { createRandomGenerator } from '../random.js';

export interface TrainTestSplitOptions {
  testSize?: number;
  shuffle?: boolean;
  seed?: number;
}

function shuffleIndices(length: number, seed: number): number[] {
  const random = createRandomGenerator(seed);
  const indices = Array.from({ length }, (_, index) => index);

  for (
    let currentIndex = indices.length - 1;
    currentIndex > 0;
    currentIndex -= 1
  ) {
    const swapIndex = Math.floor(random() * (currentIndex + 1));
    [indices[currentIndex], indices[swapIndex]] = [
      indices[swapIndex]!,
      indices[currentIndex]!
    ];
  }

  return indices;
}

export function trainTestSplit(
  features: Matrix,
  target: Vector,
  options: TrainTestSplitOptions = {}
): TrainTestSplitResult {
  assertMatchingSamples(features, target);

  const { testSize = 0.25, shuffle = true, seed = 42 } = options;
  if (testSize <= 0 || testSize >= 1) {
    throw new Ml4jsError('testSize must be between 0 and 1.');
  }

  const testCount = Math.max(1, Math.floor(features.length * testSize));
  const trainCount = features.length - testCount;
  if (trainCount === 0) {
    throw new Ml4jsError(
      'trainTestSplit requires at least one training sample.'
    );
  }

  const indices = shuffle
    ? shuffleIndices(features.length, seed)
    : Array.from({ length: features.length }, (_, index) => index);

  const trainIndices = indices.slice(0, trainCount);
  const testIndices = indices.slice(trainCount);

  return {
    xTrain: trainIndices.map((index) => features[index]!),
    xTest: testIndices.map((index) => features[index]!),
    yTrain: trainIndices.map((index) => target[index]!),
    yTest: testIndices.map((index) => target[index]!)
  };
}
