import type { Classifier, Matrix, Vector } from '../base.js';
import { Ml4jsError } from '../errors.js';
import { accuracyScore } from '../metrics/classification.js';
import {
  addIntercept,
  assertMatchingSamples,
  assertNonEmptyMatrix
} from '../math/matrix.js';

export interface LogisticRegressionOptions {
  learningRate?: number;
  iterations?: number;
}

function sigmoid(value: number): number {
  return 1 / (1 + Math.exp(-value));
}

export class LogisticRegression implements Classifier {
  private coefficients: Vector = [];

  constructor(private readonly options: LogisticRegressionOptions = {}) {}

  fit(features: Matrix, target: Vector): this {
    assertMatchingSamples(features, target);
    if (!target.every((value) => value === 0 || value === 1)) {
      throw new Ml4jsError(
        'LogisticRegression only supports binary 0/1 targets.'
      );
    }

    const designMatrix = addIntercept(features);
    const learningRate = this.options.learningRate ?? 0.1;
    const iterations = this.options.iterations ?? 2000;
    this.coefficients = Array.from(
      { length: designMatrix[0]?.length ?? 0 },
      () => 0
    );

    for (let iteration = 0; iteration < iterations; iteration += 1) {
      const gradients = new Array(this.coefficients.length).fill(0);

      for (
        let sampleIndex = 0;
        sampleIndex < designMatrix.length;
        sampleIndex += 1
      ) {
        const row = designMatrix[sampleIndex]!;
        const linearScore = row.reduce(
          (sum, value, index) => sum + value * this.coefficients[index]!,
          0
        );
        const error = sigmoid(linearScore) - target[sampleIndex]!;

        for (
          let featureIndex = 0;
          featureIndex < row.length;
          featureIndex += 1
        ) {
          gradients[featureIndex] += error * row[featureIndex]!;
        }
      }

      for (
        let featureIndex = 0;
        featureIndex < this.coefficients.length;
        featureIndex += 1
      ) {
        this.coefficients[featureIndex] =
          (this.coefficients[featureIndex] ?? 0) -
          (learningRate * gradients[featureIndex]!) / designMatrix.length;
      }
    }

    return this;
  }

  predictProba(features: Matrix): Vector {
    assertNonEmptyMatrix(features);
    if (this.coefficients.length === 0) {
      throw new Ml4jsError(
        'LogisticRegression must be fitted before predictProba is called.'
      );
    }

    const designMatrix = addIntercept(features);
    return designMatrix.map((row) =>
      sigmoid(
        row.reduce(
          (sum, value, index) => sum + value * this.coefficients[index]!,
          0
        )
      )
    );
  }

  predict(features: Matrix): Vector {
    return this.predictProba(features).map((value) => (value >= 0.5 ? 1 : 0));
  }

  score(features: Matrix, target: Vector): number {
    assertMatchingSamples(features, target);
    return accuracyScore(target, this.predict(features));
  }
}
