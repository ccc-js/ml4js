import { describe, expect, test } from 'vitest';

import { makeRegression } from '../../src/index.js';

describe('makeRegression', () => {
  test('produces deterministic data with the same seed', () => {
    const first = makeRegression({
      nSamples: 4,
      nFeatures: 2,
      noise: 0.1,
      seed: 7
    });
    const second = makeRegression({
      nSamples: 4,
      nFeatures: 2,
      noise: 0.1,
      seed: 7
    });

    expect(second).toEqual(first);
  });

  test('returns the requested dataset shape', () => {
    const dataset = makeRegression({ nSamples: 5, nFeatures: 3 });

    expect(dataset.features).toHaveLength(5);
    expect(dataset.features[0]).toHaveLength(3);
    expect(dataset.target).toHaveLength(5);
    expect(dataset.coefficients).toHaveLength(3);
  });
});
