import type { Matrix, Vector } from '../base.js';
import { Ml4jsError } from '../errors.js';
import { createRandomGenerator } from '../random.js';

export interface ClassificationDataset {
  features: Matrix;
  target: Vector;
}

export interface MakeClassificationOptions {
  nSamples?: number;
  nFeatures?: number;
  seed?: number;
}

export function makeClassification(
  options: MakeClassificationOptions = {}
): ClassificationDataset {
  const { nSamples = 100, nFeatures = 2, seed = 42 } = options;
  if (nSamples <= 1 || nFeatures <= 0) {
    throw new Ml4jsError(
      'nSamples must be > 1 and nFeatures must be positive.'
    );
  }

  const random = createRandomGenerator(seed);
  const half = Math.floor(nSamples / 2);
  const features: Matrix = [];
  const target: Vector = [];

  for (let index = 0; index < nSamples; index += 1) {
    const label = index < half ? 0 : 1;
    const center = label === 0 ? -1.5 : 1.5;
    const row = Array.from({ length: nFeatures }, (_, featureIndex) => {
      const shift = featureIndex === 0 ? center : center * 0.6;
      return shift + (random() * 2 - 1) * 0.8;
    });
    features.push(row);
    target.push(label);
  }

  return { features, target };
}
