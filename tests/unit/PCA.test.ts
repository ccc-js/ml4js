import { describe, expect, test } from 'vitest';

import { PCA } from '../../src/index.js';

describe('PCA', () => {
  test('projects data into the requested number of components', () => {
    const features = [
      [2, 0, 1],
      [3, 1, 0],
      [4, 1, 2],
      [5, 2, 1]
    ];
    const pca = new PCA(2);
    const transformed = pca.fitTransform(features);

    expect(transformed).toHaveLength(4);
    expect(transformed[0]).toHaveLength(2);
  });
});
