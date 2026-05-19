export type {
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
export { makeRegression } from './datasets/makeRegression.js';
export type {
  MakeRegressionOptions,
  RegressionDataset
} from './datasets/makeRegression.js';
export { LinearRegression } from './linear_model/LinearRegression.js';
export type { LinearRegressionOptions } from './linear_model/LinearRegression.js';
export { trainTestSplit } from './model_selection/trainTestSplit.js';
export type { TrainTestSplitOptions } from './model_selection/trainTestSplit.js';
export {
  meanAbsoluteError,
  meanSquaredError,
  r2Score
} from './metrics/regression.js';
export { Pipeline } from './pipeline/Pipeline.js';
export type { PipelineStep, PipelineTransformer } from './pipeline/Pipeline.js';
export { PolynomialFeatures } from './preprocessing/PolynomialFeatures.js';
export { StandardScaler } from './preprocessing/StandardScaler.js';
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
