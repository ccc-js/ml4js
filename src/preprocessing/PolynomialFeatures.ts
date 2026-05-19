import type { Matrix } from '../base.js';
import { Ml4jsError } from '../errors.js';
import { assertNonEmptyMatrix } from '../math/matrix.js';

export class PolynomialFeatures {
  constructor(private readonly degree = 2) {
    if (!Number.isInteger(degree) || degree < 1) {
      throw new Ml4jsError(
        'PolynomialFeatures degree must be an integer >= 1.'
      );
    }
  }

  fit(features: Matrix): this {
    assertNonEmptyMatrix(features);
    return this;
  }

  transform(features: Matrix): Matrix {
    assertNonEmptyMatrix(features);
    return features.map((row) =>
      row.flatMap((value) =>
        Array.from({ length: this.degree }, (_, index) => value ** (index + 1))
      )
    );
  }

  fitTransform(features: Matrix): Matrix {
    return this.fit(features).transform(features);
  }
}
