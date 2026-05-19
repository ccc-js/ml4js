import { describe, expect, test } from 'vitest';

import { StandardScaler } from '../../src/index.js';

describe('StandardScaler', () => {
  test('standardizes each feature column', () => {
    const scaler = new StandardScaler();
    const transformed = scaler.fitTransform([
      [1, 10],
      [2, 20],
      [3, 30]
    ]);

    expect(transformed[0]?.[0]).toBeCloseTo(-1.224744871);
    expect(transformed[1]?.[0]).toBeCloseTo(0);
    expect(transformed[2]?.[1]).toBeCloseTo(1.224744871);
  });

  test('restores original values with inverse transform', () => {
    const scaler = new StandardScaler();
    const original = [
      [1, 10],
      [2, 20],
      [3, 30]
    ];
    const transformed = scaler.fitTransform(original);

    expect(scaler.inverseTransform(transformed)).toEqual(original);
  });
});
