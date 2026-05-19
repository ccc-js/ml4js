import {
  createPredictionFigure,
  LinearRegression,
  makeRegression,
  meanSquaredError,
  Pipeline,
  PolynomialFeatures,
  trainTestSplit,
  writePlotlyHtml
} from '../src/index.js';

async function main(): Promise<void> {
  const { features, target } = makeRegression({
    nSamples: 60,
    nFeatures: 1,
    noise: 0.08,
    seed: 7
  });

  const { xTrain, xTest, yTrain, yTest } = trainTestSplit(features, target, {
    testSize: 0.25,
    seed: 11
  });

  const pipeline = new Pipeline(
    [{ name: 'poly', transformer: new PolynomialFeatures(2) }],
    new LinearRegression()
  );

  pipeline.fit(xTrain, yTrain);
  const predictions = pipeline.predict(xTest);
  const mse = meanSquaredError(yTest, predictions);

  const figure = createPredictionFigure(
    yTest,
    predictions,
    'ml4js Example: Regression'
  );
  await writePlotlyHtml('./examples/output/regression.html', figure);

  console.log('Regression example completed.');
  console.log(`Test MSE: ${mse.toFixed(6)}`);
  console.log('HTML: ./examples/output/regression.html');
}

await main();
