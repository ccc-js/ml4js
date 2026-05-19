import { Ml4jsError } from '../errors.js';
import type { Matrix, Vector } from '../base.js';

export function assertNonEmptyMatrix(features: Matrix): void {
  if (features.length === 0) {
    throw new Ml4jsError('Feature matrix must not be empty.');
  }

  const width = features[0]?.length ?? 0;
  if (width === 0) {
    throw new Ml4jsError(
      'Feature matrix must include at least one feature column.'
    );
  }

  for (const row of features) {
    if (row.length !== width) {
      throw new Ml4jsError('Feature matrix rows must have the same length.');
    }
  }
}

export function assertMatchingSamples(features: Matrix, target: Vector): void {
  assertNonEmptyMatrix(features);
  if (features.length !== target.length) {
    throw new Ml4jsError('Feature matrix row count must match target length.');
  }
}

export function transpose(matrix: Matrix): Matrix {
  assertNonEmptyMatrix(matrix);
  const firstRow = matrix[0]!;
  return firstRow.map((_, columnIndex) =>
    matrix.map((row) => row[columnIndex] ?? 0)
  );
}

export function multiplyMatrices(left: Matrix, right: Matrix): Matrix {
  assertNonEmptyMatrix(left);
  assertNonEmptyMatrix(right);

  const sharedSize = left[0]?.length ?? 0;
  if (sharedSize !== right.length) {
    throw new Ml4jsError(
      'Matrix dimensions are incompatible for multiplication.'
    );
  }

  return left.map((leftRow) =>
    (right[0] ?? []).map((_, columnIndex) =>
      leftRow.reduce(
        (sum, leftValue, sharedIndex) =>
          sum + leftValue * (right[sharedIndex]?.[columnIndex] ?? 0),
        0
      )
    )
  );
}

export function multiplyMatrixVector(matrix: Matrix, vector: Vector): Vector {
  assertNonEmptyMatrix(matrix);
  if ((matrix[0]?.length ?? 0) !== vector.length) {
    throw new Ml4jsError('Matrix and vector dimensions are incompatible.');
  }

  return matrix.map((row) =>
    row.reduce((sum, value, index) => sum + value * vector[index]!, 0)
  );
}

export function addIntercept(features: Matrix): Matrix {
  assertNonEmptyMatrix(features);
  return features.map((row) => [1, ...row]);
}

export function invertMatrix(matrix: Matrix): Matrix {
  assertNonEmptyMatrix(matrix);
  const size = matrix.length;
  if ((matrix[0]?.length ?? 0) !== size) {
    throw new Ml4jsError('Only square matrices can be inverted.');
  }

  const augmented = matrix.map((row, rowIndex) => [
    ...row,
    ...Array.from({ length: size }, (_, columnIndex) =>
      rowIndex === columnIndex ? 1 : 0
    )
  ]);

  for (let pivotIndex = 0; pivotIndex < size; pivotIndex += 1) {
    let pivotRow = pivotIndex;
    while ((augmented[pivotRow]?.[pivotIndex] ?? 0) === 0 && pivotRow < size) {
      pivotRow += 1;
    }

    if (pivotRow === size) {
      throw new Ml4jsError(
        'Matrix is singular. Consider changing the data or using regularization.'
      );
    }

    if (pivotRow !== pivotIndex) {
      [augmented[pivotIndex], augmented[pivotRow]] = [
        augmented[pivotRow]!,
        augmented[pivotIndex]!
      ];
    }

    const pivot = augmented[pivotIndex]?.[pivotIndex] ?? 0;
    if (pivot === 0) {
      throw new Ml4jsError(
        'Matrix inversion failed because a zero pivot remained.'
      );
    }

    augmented[pivotIndex] = augmented[pivotIndex]!.map(
      (value) => value / pivot
    );

    for (let rowIndex = 0; rowIndex < size; rowIndex += 1) {
      if (rowIndex === pivotIndex) {
        continue;
      }

      const factor = augmented[rowIndex]?.[pivotIndex] ?? 0;
      augmented[rowIndex] = augmented[rowIndex]!.map(
        (value, columnIndex) =>
          value - factor * (augmented[pivotIndex]?.[columnIndex] ?? 0)
      );
    }
  }

  return augmented.map((row) => row.slice(size));
}

export function solveNormalEquation(
  features: Matrix,
  target: Vector,
  regularization = 1e-8
): Vector {
  const designMatrix = addIntercept(features);
  const transposed = transpose(designMatrix);
  const xtx = multiplyMatrices(transposed, designMatrix);

  for (let diagonalIndex = 1; diagonalIndex < xtx.length; diagonalIndex += 1) {
    const row = xtx[diagonalIndex];
    if (row === undefined) {
      throw new Ml4jsError(
        'Normal equation construction produced an invalid matrix.'
      );
    }
    row[diagonalIndex] = (row[diagonalIndex] ?? 0) + regularization;
  }

  const xtxInverse = invertMatrix(xtx);
  const xty = multiplyMatrixVector(transposed, target);
  return multiplyMatrixVector(xtxInverse, xty);
}
