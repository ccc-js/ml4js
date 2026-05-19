import { access, readFile } from 'node:fs/promises';

import { describe, expect, test } from 'vitest';

import {
  createPredictionFigure,
  LinearRegression,
  meanSquaredError,
  PolynomialFeatures,
  Pipeline,
  makeRegression,
  trainTestSplit,
  writePlotlyHtml
} from '../../src/index.js';

describe('ml4js system flow', () => {
  test('runs synthetic data generation, split, polynomial regression, and plot export', async () => {
    const { features, target } = makeRegression({
      nSamples: 24,
      nFeatures: 1,
      noise: 0.05,
      seed: 7
    });

    const { xTrain, xTest, yTrain, yTest } = trainTestSplit(features, target, {
      testSize: 0.25,
      seed: 3
    });

    const pipeline = new Pipeline(
      [{ name: 'poly', transformer: new PolynomialFeatures(2) }],
      new LinearRegression()
    );
    pipeline.fit(xTrain, yTrain);

    const predictions = pipeline.predict(xTest);
    expect(meanSquaredError(yTest, predictions)).toBeLessThan(0.02);
    expect(pipeline.score(xTest, yTest)).toBeGreaterThan(0.95);

    const figure = createPredictionFigure(
      yTest,
      predictions,
      'ml4js v0.3 demo'
    );
    const outputPath = './tests/.tmp/regression-demo.html';

    await writePlotlyHtml(outputPath, figure);
    await access(outputPath);

    const html = await readFile(outputPath, 'utf8');
    expect(html).toContain('Plotly.newPlot');
    expect(html).toContain('ml4js v0.3 demo');
  });
});
