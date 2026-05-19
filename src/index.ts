export type {
  Classifier,
  Estimator,
  Matrix,
  Predictor,
  Regressor,
  Scorable,
  TrainTestSplitResult,
  Transformer,
  Vector
} from './base.js';
export { Ml4jsError } from './errors.js';
export { makeClassification } from './datasets/makeClassification.js';
export type {
  ClassificationDataset,
  MakeClassificationOptions
} from './datasets/makeClassification.js';
export { makeRegression } from './datasets/makeRegression.js';
export type {
  MakeRegressionOptions,
  RegressionDataset
} from './datasets/makeRegression.js';
export { LinearRegression } from './linear_model/LinearRegression.js';
export type { LinearRegressionOptions } from './linear_model/LinearRegression.js';
export { LogisticRegression } from './linear_model/LogisticRegression.js';
export type { LogisticRegressionOptions } from './linear_model/LogisticRegression.js';
export { trainTestSplit } from './model_selection/trainTestSplit.js';
export type { TrainTestSplitOptions } from './model_selection/trainTestSplit.js';
export {
  accuracyScore,
  precisionScore,
  recallScore
} from './metrics/classification.js';
export {
  meanAbsoluteError,
  meanSquaredError,
  r2Score
} from './metrics/regression.js';
export { Pipeline } from './pipeline/Pipeline.js';
export type { PipelineStep, PipelineTransformer } from './pipeline/Pipeline.js';
export { PolynomialFeatures } from './preprocessing/PolynomialFeatures.js';
export { StandardScaler } from './preprocessing/StandardScaler.js';
export { createClassificationFigure } from './plotting/classification.js';
export {
  createPredictionFigure,
  createRegressionFigure,
  renderPlotlyHtml,
  writePlotlyHtml
} from './plotting/regression.js';
export type {
  PlotlyFigure,
  PlotlyLayout,
  PlotlyTrace
} from './plotting/regression.js';
