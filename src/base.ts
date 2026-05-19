export type Vector = number[];
export type Matrix = number[][];

export interface Estimator {
  fit(features: Matrix, target: Vector): this;
}

export interface Predictor {
  predict(features: Matrix): Vector;
}

export interface Scorable {
  score(features: Matrix, target: Vector): number;
}

export interface Regressor extends Estimator, Predictor, Scorable {}

export interface Transformer {
  fit(features: Matrix): this;
  transform(features: Matrix): Matrix;
  fitTransform(features: Matrix): Matrix;
}
