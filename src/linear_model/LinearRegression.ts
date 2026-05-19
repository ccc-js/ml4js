import type { Matrix, Regressor, Vector } from '../base.js';
import { Ml4jsError } from '../errors.js';
import { r2Score } from '../metrics/regression.js';
import {
  assertMatchingSamples,
  assertNonEmptyMatrix,
  addIntercept,
  multiplyMatrixVector,
  solveNormalEquation
} from '../math/matrix.js';

export interface LinearRegressionOptions {
  regularization?: number;
}

export class LinearRegression implements Regressor {
  private coefficients: Vector = [];

  constructor(private readonly options: LinearRegressionOptions = {}) {}

  fit(features: Matrix, target: Vector): this {
    assertMatchingSamples(features, target);
    this.coefficients = solveNormalEquation(
      features,
      target,
      this.options.regularization
    );
    return this;
  }

  predict(features: Matrix): Vector {
    assertNonEmptyMatrix(features);
    if (this.coefficients.length === 0) {
      throw new Ml4jsError(
        'LinearRegression must be fitted before predict is called.'
      );
    }

    return multiplyMatrixVector(addIntercept(features), this.coefficients);
  }

  score(features: Matrix, target: Vector): number {
    assertMatchingSamples(features, target);
    return r2Score(target, this.predict(features));
  }

  get intercept(): number {
    if (this.coefficients.length === 0) {
      throw new Ml4jsError('LinearRegression has not been fitted yet.');
    }
    return this.coefficients[0]!;
  }

  get weights(): Vector {
    if (this.coefficients.length === 0) {
      throw new Ml4jsError('LinearRegression has not been fitted yet.');
    }
    return this.coefficients.slice(1);
  }
}
