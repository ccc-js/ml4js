import type { Matrix, Vector } from '../base.js';
import { Ml4jsError } from '../errors.js';
import { assertNonEmptyMatrix } from '../math/matrix.js';

export class StandardScaler {
  private means: Vector = [];

  private standardDeviations: Vector = [];

  fit(features: Matrix): this {
    assertNonEmptyMatrix(features);
    const columnCount = features[0]?.length ?? 0;

    this.means = Array.from({ length: columnCount }, (_, columnIndex) => {
      const sum = features.reduce(
        (accumulator, row) => accumulator + (row[columnIndex] ?? 0),
        0
      );
      return sum / features.length;
    });

    this.standardDeviations = Array.from(
      { length: columnCount },
      (_, columnIndex) => {
        const variance =
          features.reduce((accumulator, row) => {
            const difference =
              (row[columnIndex] ?? 0) - this.means[columnIndex]!;
            return accumulator + difference ** 2;
          }, 0) / features.length;
        return Math.sqrt(variance) || 1;
      }
    );

    return this;
  }

  transform(features: Matrix): Matrix {
    assertNonEmptyMatrix(features);
    if (this.means.length === 0 || this.standardDeviations.length === 0) {
      throw new Ml4jsError(
        'StandardScaler must be fitted before transform is called.'
      );
    }

    return features.map((row) =>
      row.map(
        (value, columnIndex) =>
          (value - this.means[columnIndex]!) /
          this.standardDeviations[columnIndex]!
      )
    );
  }

  fitTransform(features: Matrix): Matrix {
    return this.fit(features).transform(features);
  }

  inverseTransform(features: Matrix): Matrix {
    assertNonEmptyMatrix(features);
    if (this.means.length === 0 || this.standardDeviations.length === 0) {
      throw new Ml4jsError(
        'StandardScaler must be fitted before inverseTransform is called.'
      );
    }

    return features.map((row) =>
      row.map(
        (value, columnIndex) =>
          value * this.standardDeviations[columnIndex]! +
          this.means[columnIndex]!
      )
    );
  }
}
