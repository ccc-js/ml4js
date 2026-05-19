import type { Matrix, Vector } from '../base.js';
import { Ml4jsError } from '../errors.js';
import { assertNonEmptyMatrix } from '../math/matrix.js';

export interface KMeansOptions {
  maxIterations?: number;
}

function squaredDistance(left: number[], right: number[]): number {
  return left.reduce((sum, value, index) => {
    const difference = value - (right[index] ?? 0);
    return sum + difference * difference;
  }, 0);
}

function meanPoint(points: Matrix): number[] {
  const width = points[0]?.length ?? 0;
  return Array.from({ length: width }, (_, columnIndex) => {
    const total = points.reduce((sum, row) => sum + (row[columnIndex] ?? 0), 0);
    return total / points.length;
  });
}

export class KMeans {
  private centroids: Matrix = [];

  constructor(
    private readonly nClusters: number,
    private readonly options: KMeansOptions = {}
  ) {
    if (!Number.isInteger(nClusters) || nClusters <= 0) {
      throw new Ml4jsError('KMeans nClusters must be a positive integer.');
    }
  }

  fit(features: Matrix): this {
    assertNonEmptyMatrix(features);
    if (features.length < this.nClusters) {
      throw new Ml4jsError(
        'KMeans requires at least as many samples as clusters.'
      );
    }

    const maxIterations = this.options.maxIterations ?? 100;
    this.centroids = features.slice(0, this.nClusters).map((row) => [...row]);

    for (let iteration = 0; iteration < maxIterations; iteration += 1) {
      const assignments = this.predict(features);
      const nextCentroids = this.centroids.map((centroid, clusterIndex) => {
        const clusterPoints = features.filter(
          (_, sampleIndex) => assignments[sampleIndex] === clusterIndex
        );
        return clusterPoints.length > 0 ? meanPoint(clusterPoints) : centroid;
      });

      const unchanged = nextCentroids.every((centroid, clusterIndex) =>
        centroid.every(
          (value, featureIndex) =>
            Math.abs(
              value - (this.centroids[clusterIndex]?.[featureIndex] ?? 0)
            ) < 1e-9
        )
      );
      this.centroids = nextCentroids;

      if (unchanged) {
        break;
      }
    }

    return this;
  }

  predict(features: Matrix): Vector {
    assertNonEmptyMatrix(features);
    if (this.centroids.length === 0) {
      throw new Ml4jsError('KMeans must be fitted before predict is called.');
    }

    return features.map((row) => {
      let bestCluster = 0;
      let bestDistance = Number.POSITIVE_INFINITY;

      for (
        let clusterIndex = 0;
        clusterIndex < this.centroids.length;
        clusterIndex += 1
      ) {
        const distance = squaredDistance(row, this.centroids[clusterIndex]!);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestCluster = clusterIndex;
        }
      }

      return bestCluster;
    });
  }

  get clusterCenters(): Matrix {
    if (this.centroids.length === 0) {
      throw new Ml4jsError('KMeans has not been fitted yet.');
    }
    return this.centroids.map((row) => [...row]);
  }
}
