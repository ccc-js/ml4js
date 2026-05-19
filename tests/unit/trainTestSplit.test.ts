import { describe, expect, test } from 'vitest';

import { trainTestSplit } from '../../src/index.js';

describe('trainTestSplit', () => {
  test('splits data reproducibly when shuffle is enabled', () => {
    const features = [[1], [2], [3], [4], [5], [6]];
    const target = [10, 20, 30, 40, 50, 60];

    const result = trainTestSplit(features, target, {
      testSize: 1 / 3,
      seed: 7
    });

    expect(result.xTrain).toEqual([[6], [1], [4], [3]]);
    expect(result.xTest).toEqual([[5], [2]]);
    expect(result.yTrain).toEqual([60, 10, 40, 30]);
    expect(result.yTest).toEqual([50, 20]);
  });

  test('keeps order when shuffle is disabled', () => {
    const features = [[1], [2], [3], [4]];
    const target = [10, 20, 30, 40];

    const result = trainTestSplit(features, target, {
      testSize: 0.5,
      shuffle: false
    });

    expect(result.xTrain).toEqual([[1], [2]]);
    expect(result.xTest).toEqual([[3], [4]]);
    expect(result.yTrain).toEqual([10, 20]);
    expect(result.yTest).toEqual([30, 40]);
  });
});
