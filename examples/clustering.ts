import {
  createClusterFigure,
  KMeans,
  makeBlobs,
  PCA,
  writePlotlyHtml
} from '../src/index.js';

async function main(): Promise<void> {
  const { features } = makeBlobs({
    nSamples: 90,
    centers: 3,
    nFeatures: 3,
    seed: 7
  });

  const projected = new PCA(2).fitTransform(features);
  const kmeans = new KMeans(3);
  kmeans.fit(projected);
  const labels = kmeans.predict(projected);

  const figure = createClusterFigure(
    projected,
    labels,
    'ml4js Example: Clustering'
  );
  await writePlotlyHtml('./examples/output/clustering.html', figure);

  console.log('Clustering example completed.');
  console.log(`Clusters found: ${new Set(labels).size}`);
  console.log('HTML: ./examples/output/clustering.html');
}

await main();
