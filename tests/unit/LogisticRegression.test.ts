import { describe, expect, test } from 'vitest';

import { LogisticRegression, makeClassification } from '../../src/index.js';

describe('LogisticRegression', () => {
  test('fits a binary classifier and predicts accurately', () => {
    const { features, target } = makeClassification({
      nSamples: 60,
      nFeatures: 2,
      seed: 7
    });
    const model = new LogisticRegression();

    model.fit(features, target);
    const predictions = model.predict(features);
    const probabilities = model.predictProba(features);

    expect(probabilities[0]).toBeGreaterThanOrEqual(0);
    expect(probabilities[0]).toBeLessThanOrEqual(1);
    expect(predictions).toHaveLength(target.length);
    expect(model.score(features, target)).toBeGreaterThan(0.95);
  });
});
