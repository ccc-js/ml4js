import type { Matrix, Vector } from '../base.js';
import { Ml4jsError } from '../errors.js';
import { createRandomGenerator } from '../random.js';

export interface RegressionDataset {
  features: Matrix;
  target: Vector;
  coefficients: Vector;
  intercept: number;
}

export interface MakeRegressionOptions {
  nSamples?: number;
  nFeatures?: number;
  noise?: number;
  bias?: number;
  seed?: number;
}

export function makeRegression(
  options: MakeRegressionOptions = {}
): RegressionDataset {
  const {
    nSamples = 100,
    nFeatures = 1,
    noise = 0,
    bias = 0,
    seed = 42
  } = options;

  if (nSamples <= 0 || nFeatures <= 0) {
    throw new Ml4jsError('nSamples and nFeatures must be positive.');
  }

  const random = createRandomGenerator(seed);
  const coefficients = Array.from(
    { length: nFeatures },
    () => random() * 4 - 2
  );

  const features = Array.from({ length: nSamples }, () =>
    Array.from({ length: nFeatures }, () => random() * 2 - 1)
  );

  const target = features.map((row) => {
    const signal =
      row.reduce(
        (sum, value, index) => sum + value * coefficients[index]!,
        bias
      ) +
      (random() * 2 - 1) * noise;
    return signal;
  });

  return {
    features,
    target,
    coefficients,
    intercept: bias
  };
}
