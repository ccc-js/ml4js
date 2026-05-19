import { access, readFile } from 'node:fs/promises';

import { describe, expect, test } from 'vitest';

import {
  accuracyScore,
  createClassificationFigure,
  createClusterFigure,
  createPredictionFigure,
  KMeans,
  LinearRegression,
  LogisticRegression,
  makeBlobs,
  meanSquaredError,
  PCA,
  makeClassification,
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

  test('runs classification training, scoring, and plot export', async () => {
    const { features, target } = makeClassification({
      nSamples: 40,
      nFeatures: 2,
      seed: 9
    });
    const { xTrain, xTest, yTrain, yTest } = trainTestSplit(features, target, {
      testSize: 0.25,
      seed: 5
    });

    const model = new LogisticRegression();
    model.fit(xTrain, yTrain);
    const predictions = model.predict(xTest);

    expect(accuracyScore(yTest, predictions)).toBeGreaterThan(0.9);

    const figure = createClassificationFigure(
      xTest,
      predictions,
      'ml4js v0.4 classification'
    );
    const outputPath = './tests/.tmp/classification-demo.html';

    await writePlotlyHtml(outputPath, figure);
    await access(outputPath);

    const html = await readFile(outputPath, 'utf8');
    expect(html).toContain('Plotly.newPlot');
    expect(html).toContain('ml4js v0.4 classification');
  });

  test('runs blob generation, pca projection, clustering, and plot export', async () => {
    const { features } = makeBlobs({
      nSamples: 45,
      centers: 3,
      nFeatures: 3,
      seed: 11
    });

    const projected = new PCA(2).fitTransform(features);
    const kmeans = new KMeans(3);
    kmeans.fit(projected);
    const labels = kmeans.predict(projected);

    expect(labels).toHaveLength(projected.length);
    expect(new Set(labels).size).toBe(3);

    const figure = createClusterFigure(
      projected,
      labels,
      'ml4js v0.5 clustering'
    );
    const outputPath = './tests/.tmp/clustering-demo.html';

    await writePlotlyHtml(outputPath, figure);
    await access(outputPath);

    const html = await readFile(outputPath, 'utf8');
    expect(html).toContain('Plotly.newPlot');
    expect(html).toContain('ml4js v0.5 clustering');
  });
});
