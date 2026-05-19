import { describe, expect, test } from 'vitest';

import { accuracyScore, precisionScore, recallScore } from '../../src/index.js';

describe('classification metrics', () => {
  test('compute accuracy', () => {
    expect(accuracyScore([1, 0, 1, 1], [1, 0, 0, 1])).toBeCloseTo(0.75);
  });

  test('compute precision', () => {
    expect(precisionScore([1, 0, 1, 1], [1, 0, 0, 1])).toBeCloseTo(1);
  });

  test('compute recall', () => {
    expect(recallScore([1, 0, 1, 1], [1, 0, 0, 1])).toBeCloseTo(2 / 3);
  });
});
