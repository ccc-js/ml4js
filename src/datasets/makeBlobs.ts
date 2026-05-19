import type { Matrix, Vector } from '../base.js';
import { Ml4jsError } from '../errors.js';
import { createRandomGenerator } from '../random.js';

export interface BlobDataset {
  features: Matrix;
  labels: Vector;
}

export interface MakeBlobsOptions {
  nSamples?: number;
  centers?: number;
  nFeatures?: number;
  seed?: number;
}

export function makeBlobs(options: MakeBlobsOptions = {}): BlobDataset {
  const { nSamples = 90, centers = 3, nFeatures = 2, seed = 42 } = options;
  if (nSamples <= 0 || centers <= 0 || nFeatures <= 0) {
    throw new Ml4jsError('nSamples, centers, and nFeatures must be positive.');
  }

  const random = createRandomGenerator(seed);
  const centersList = Array.from({ length: centers }, (_, centerIndex) =>
    Array.from({ length: nFeatures }, (_, featureIndex) => {
      const base = centerIndex * 4 - ((centers - 1) * 4) / 2;
      return base + featureIndex * 0.75;
    })
  );

  const features: Matrix = [];
  const labels: Vector = [];

  for (let index = 0; index < nSamples; index += 1) {
    const label = index % centers;
    const row = centersList[label]!.map(
      (centerValue) => centerValue + (random() * 2 - 1) * 0.6
    );
    features.push(row);
    labels.push(label);
  }

  return { features, labels };
}
