import { access, readFile } from 'node:fs/promises';

import { describe, expect, test } from 'vitest';

import {
  createRegressionFigure,
  LinearRegression,
  meanSquaredError,
  Pipeline,
  StandardScaler,
  trainTestSplit,
  writePlotlyHtml
} from '../../src/index.js';

describe('ml4js system flow', () => {
  test('runs split, preprocessing, training, scoring, and plot export', async () => {
    const features = [[1], [2], [3], [4], [5], [6], [7], [8]];
    const target = [5, 7, 9, 11, 13, 15, 17, 19];

    const { xTrain, xTest, yTrain, yTest } = trainTestSplit(features, target, {
      testSize: 0.25,
      shuffle: false
    });

    const pipeline = new Pipeline(
      [{ name: 'scale', transformer: new StandardScaler() }],
      new LinearRegression()
    );
    pipeline.fit(xTrain, yTrain);

    const predictions = pipeline.predict(xTest);
    expect(meanSquaredError(yTest, predictions)).toBeLessThan(1e-8);
    expect(pipeline.score(xTest, yTest)).toBeCloseTo(1);

    const figure = createRegressionFigure(
      xTest.map((row) => row[0] ?? 0),
      yTest,
      predictions,
      'ml4js v0.2 demo'
    );
    const outputPath = './tests/.tmp/regression-demo.html';

    await writePlotlyHtml(outputPath, figure);
    await access(outputPath);

    const html = await readFile(outputPath, 'utf8');
    expect(html).toContain('Plotly.newPlot');
    expect(html).toContain('ml4js v0.2 demo');
  });
});
