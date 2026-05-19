import { access, readFile } from 'node:fs/promises';

import { describe, expect, test } from 'vitest';

import {
  createRegressionFigure,
  LinearRegression,
  meanSquaredError,
  StandardScaler,
  writePlotlyHtml
} from '../../src/index.js';

describe('ml4js system flow', () => {
  test('runs preprocessing, training, scoring, and plot export', async () => {
    const features = [[1], [2], [3], [4], [5], [6]];
    const target = [5, 7, 9, 11, 13, 15];

    const scaler = new StandardScaler();
    const scaledFeatures = scaler.fitTransform(features);

    const model = new LinearRegression();
    model.fit(scaledFeatures, target);

    const predictions = model.predict(scaledFeatures);
    expect(meanSquaredError(target, predictions)).toBeLessThan(1e-8);

    const figure = createRegressionFigure(
      features.map((row) => row[0] ?? 0),
      target,
      predictions,
      'ml4js v0.1 demo'
    );
    const outputPath = './tests/.tmp/regression-demo.html';

    await writePlotlyHtml(outputPath, figure);
    await access(outputPath);

    const html = await readFile(outputPath, 'utf8');
    expect(html).toContain('Plotly.newPlot');
    expect(html).toContain('ml4js v0.1 demo');
  });
});
