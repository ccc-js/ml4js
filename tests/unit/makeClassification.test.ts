import { describe, expect, test } from 'vitest';

import { makeClassification } from '../../src/index.js';

describe('makeClassification', () => {
  test('produces deterministic data with the same seed', () => {
    const first = makeClassification({ nSamples: 8, nFeatures: 2, seed: 7 });
    const second = makeClassification({ nSamples: 8, nFeatures: 2, seed: 7 });

    expect(second).toEqual(first);
  });

  test('returns the requested dataset shape', () => {
    const dataset = makeClassification({ nSamples: 6, nFeatures: 2 });

    expect(dataset.features).toHaveLength(6);
    expect(dataset.features[0]).toHaveLength(2);
    expect(dataset.target).toHaveLength(6);
  });
});
