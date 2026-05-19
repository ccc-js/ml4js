export type {
  Estimator,
  Matrix,
  Predictor,
  Regressor,
  Scorable,
  Transformer,
  Vector
} from './base.js';
export { Ml4jsError } from './errors.js';
export { LinearRegression } from './linear_model/LinearRegression.js';
export type { LinearRegressionOptions } from './linear_model/LinearRegression.js';
export {
  meanAbsoluteError,
  meanSquaredError,
  r2Score
} from './metrics/regression.js';
export { StandardScaler } from './preprocessing/StandardScaler.js';
export {
  createRegressionFigure,
  renderPlotlyHtml,
  writePlotlyHtml
} from './plotting/regression.js';
export type {
  PlotlyFigure,
  PlotlyLayout,
  PlotlyTrace
} from './plotting/regression.js';
