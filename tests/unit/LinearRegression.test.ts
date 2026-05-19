import { describe, expect, test } from 'vitest';

import { LinearRegression } from '../../src/index.js';

describe('LinearRegression', () => {
  test('fits a simple line and predicts accurately', () => {
    const model = new LinearRegression();
    const features = [[1], [2], [3], [4], [5]];
    const target = [3, 5, 7, 9, 11];

    model.fit(features, target);
    const predictions = model.predict(features);

    expect(model.intercept).toBeCloseTo(1);
    expect(model.weights[0]).toBeCloseTo(2);
    expect(predictions[4]).toBeCloseTo(11);
    expect(model.score(features, target)).toBeCloseTo(1);
  });
});
