import { describe, expect, test } from 'vitest';

import {
  meanAbsoluteError,
  meanSquaredError,
  r2Score
} from '../../src/index.js';

describe('regression metrics', () => {
  test('compute mean squared error', () => {
    expect(meanSquaredError([3, -0.5, 2, 7], [2.5, 0, 2, 8])).toBeCloseTo(
      0.375
    );
  });

  test('compute mean absolute error', () => {
    expect(meanAbsoluteError([3, -0.5, 2, 7], [2.5, 0, 2, 8])).toBeCloseTo(0.5);
  });

  test('compute r2 score', () => {
    expect(r2Score([3, -0.5, 2, 7], [2.5, 0, 2, 8])).toBeCloseTo(0.948608137);
  });
});
