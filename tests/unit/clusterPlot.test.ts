import { describe, expect, test } from 'vitest';

import { createClusterFigure, makeBlobs } from '../../src/index.js';

describe('cluster plotting', () => {
  test('creates a 2d cluster scatter plot', () => {
    const { features, labels } = makeBlobs({
      nSamples: 12,
      centers: 3,
      seed: 7
    });
    const figure = createClusterFigure(features, labels, 'cluster demo');

    expect(figure.data).toHaveLength(3);
    expect(figure.layout.title).toBe('cluster demo');
  });
});
