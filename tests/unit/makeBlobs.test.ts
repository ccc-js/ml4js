import { describe, expect, test } from 'vitest';

import { makeBlobs } from '../../src/index.js';

describe('makeBlobs', () => {
  test('produces deterministic blobs with the same seed', () => {
    const first = makeBlobs({ nSamples: 9, centers: 3, seed: 7 });
    const second = makeBlobs({ nSamples: 9, centers: 3, seed: 7 });

    expect(second).toEqual(first);
  });

  test('returns the requested blob shape', () => {
    const dataset = makeBlobs({ nSamples: 12, centers: 3, nFeatures: 2 });

    expect(dataset.features).toHaveLength(12);
    expect(dataset.features[0]).toHaveLength(2);
    expect(dataset.labels).toHaveLength(12);
  });
});
