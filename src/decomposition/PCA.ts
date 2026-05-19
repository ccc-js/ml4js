import type { Matrix, Vector } from '../base.js';
import { Ml4jsError } from '../errors.js';
import { assertNonEmptyMatrix, transpose } from '../math/matrix.js';

export class PCA {
  private means: Vector = [];

  private components: Matrix = [];

  constructor(private readonly nComponents: number) {
    if (!Number.isInteger(nComponents) || nComponents <= 0) {
      throw new Ml4jsError('PCA nComponents must be a positive integer.');
    }
  }

  fit(features: Matrix): this {
    assertNonEmptyMatrix(features);
    const width = features[0]?.length ?? 0;
    if (this.nComponents > width) {
      throw new Ml4jsError('PCA nComponents cannot exceed feature count.');
    }

    this.means = Array.from({ length: width }, (_, columnIndex) => {
      const total = features.reduce(
        (sum, row) => sum + (row[columnIndex] ?? 0),
        0
      );
      return total / features.length;
    });

    const centered = features.map((row) =>
      row.map((value, columnIndex) => value - this.means[columnIndex]!)
    );
    const covariance = this.computeCovariance(centered);
    this.components = this.extractComponents(covariance, this.nComponents);
    return this;
  }

  transform(features: Matrix): Matrix {
    assertNonEmptyMatrix(features);
    if (this.components.length === 0 || this.means.length === 0) {
      throw new Ml4jsError('PCA must be fitted before transform is called.');
    }

    return features.map((row) => {
      const centered = row.map(
        (value, columnIndex) => value - this.means[columnIndex]!
      );
      return this.components.map((component) =>
        component.reduce(
          (sum, value, index) => sum + value * centered[index]!,
          0
        )
      );
    });
  }

  fitTransform(features: Matrix): Matrix {
    return this.fit(features).transform(features);
  }

  private computeCovariance(features: Matrix): Matrix {
    const transposed = transpose(features);
    return transposed.map((leftRow) =>
      transposed.map((rightRow) => {
        const dotProduct = leftRow.reduce(
          (sum, value, index) => sum + value * rightRow[index]!,
          0
        );
        return dotProduct / Math.max(features.length - 1, 1);
      })
    );
  }

  private extractComponents(covariance: Matrix, count: number): Matrix {
    const working = covariance.map((row) => [...row]);
    const components: Matrix = [];

    for (let componentIndex = 0; componentIndex < count; componentIndex += 1) {
      let vector = Array.from({ length: working.length }, () => 1);

      for (let iteration = 0; iteration < 30; iteration += 1) {
        const multiplied = working.map((row) =>
          row.reduce((sum, value, index) => sum + value * vector[index]!, 0)
        );
        const norm = Math.sqrt(
          multiplied.reduce((sum, value) => sum + value * value, 0)
        );
        if (norm === 0) {
          break;
        }
        vector = multiplied.map((value) => value / norm);
      }

      const eigenvalue = vector.reduce(
        (sum, value, rowIndex) =>
          sum +
          value *
            working[rowIndex]!.reduce(
              (rowSum, rowValue, columnIndex) =>
                rowSum + rowValue * vector[columnIndex]!,
              0
            ),
        0
      );

      components.push(vector);

      for (let rowIndex = 0; rowIndex < working.length; rowIndex += 1) {
        const row = working[rowIndex];
        if (row === undefined) {
          throw new Ml4jsError(
            'PCA deflation produced an invalid covariance matrix.'
          );
        }
        for (let columnIndex = 0; columnIndex < row.length; columnIndex += 1) {
          row[columnIndex] =
            (row[columnIndex] ?? 0) -
            eigenvalue * vector[rowIndex]! * vector[columnIndex]!;
        }
      }
    }

    return components;
  }
}
