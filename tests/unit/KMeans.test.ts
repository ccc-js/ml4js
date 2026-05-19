import { describe, expect, test } from 'vitest';

import { KMeans, makeBlobs } from '../../src/index.js';

describe('KMeans', () => {
  test('fits and predicts cluster assignments', () => {
    const { features } = makeBlobs({ nSamples: 30, centers: 3, seed: 7 });
    const model = new KMeans(3);

    model.fit(features);
    const labels = model.predict(features);

    expect(labels).toHaveLength(features.length);
    expect(new Set(labels).size).toBe(3);
    expect(model.clusterCenters).toHaveLength(3);
  });
});
