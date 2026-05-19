import {
  accuracyScore,
  createClassificationFigure,
  LogisticRegression,
  makeClassification,
  trainTestSplit,
  writePlotlyHtml
} from '../src/index.js';

async function main(): Promise<void> {
  const { features, target } = makeClassification({
    nSamples: 80,
    nFeatures: 2,
    seed: 7
  });

  const { xTrain, xTest, yTrain, yTest } = trainTestSplit(features, target, {
    testSize: 0.25,
    seed: 5
  });

  const model = new LogisticRegression();
  model.fit(xTrain, yTrain);
  const predictions = model.predict(xTest);
  const accuracy = accuracyScore(yTest, predictions);

  const figure = createClassificationFigure(
    xTest,
    predictions,
    'ml4js Example: Classification'
  );
  await writePlotlyHtml('./examples/output/classification.html', figure);

  console.log('Classification example completed.');
  console.log(`Test accuracy: ${accuracy.toFixed(4)}`);
  console.log('HTML: ./examples/output/classification.html');
}

await main();
