import { describe, expect, test } from 'vitest';

import { PolynomialFeatures } from '../../src/index.js';

describe('PolynomialFeatures', () => {
  test('expands each feature up to the target degree', () => {
    const transformer = new PolynomialFeatures(3);

    expect(transformer.fitTransform([[2], [3]])).toEqual([
      [2, 4, 8],
      [3, 9, 27]
    ]);
  });

  test('expands multiple features independently', () => {
    const transformer = new PolynomialFeatures(2);

    expect(transformer.transform([[2, 3]])).toEqual([[2, 4, 3, 9]]);
  });
});
