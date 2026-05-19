import { describe, expect, test } from 'vitest';

import { LinearRegression, Pipeline, StandardScaler } from '../../src/index.js';

describe('Pipeline', () => {
  test('fits and predicts through preprocessing steps', () => {
    const pipeline = new Pipeline(
      [{ name: 'scale', transformer: new StandardScaler() }],
      new LinearRegression()
    );
    const features = [[1], [2], [3], [4], [5]];
    const target = [3, 5, 7, 9, 11];

    pipeline.fit(features, target);
    const predictions = pipeline.predict(features);

    expect(predictions[0]).toBeCloseTo(3);
    expect(predictions[4]).toBeCloseTo(11);
    expect(pipeline.score(features, target)).toBeCloseTo(1);
  });
});
