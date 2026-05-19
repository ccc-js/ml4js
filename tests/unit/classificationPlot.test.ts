import { describe, expect, test } from 'vitest';

import {
  createClassificationFigure,
  makeClassification
} from '../../src/index.js';

describe('classification plotting', () => {
  test('creates a 2d class scatter plot', () => {
    const { features, target } = makeClassification({ nSamples: 10, seed: 7 });
    const figure = createClassificationFigure(
      features,
      target,
      'classification demo'
    );

    expect(figure.data).toHaveLength(2);
    expect(figure.layout.title).toBe('classification demo');
  });
});
