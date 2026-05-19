import type { Matrix } from '../base.js';
import { Ml4jsError } from '../errors.js';
import type { PlotlyFigure } from './regression.js';

export function createClassificationFigure(
  features: Matrix,
  target: number[],
  title = 'Classification Results'
): PlotlyFigure {
  if (features.length === 0 || target.length === 0) {
    throw new Ml4jsError('Plot inputs must not be empty.');
  }

  if (features.length !== target.length) {
    throw new Ml4jsError('Plot inputs must have the same length.');
  }

  if ((features[0]?.length ?? 0) < 2) {
    throw new Ml4jsError(
      'Classification plot requires at least 2 feature columns.'
    );
  }

  const zeros = features.filter((_, index) => target[index] === 0);
  const ones = features.filter((_, index) => target[index] === 1);

  return {
    data: [
      {
        x: zeros.map((row) => row[0] ?? 0),
        y: zeros.map((row) => row[1] ?? 0),
        mode: 'markers',
        type: 'scatter',
        name: 'Class 0'
      },
      {
        x: ones.map((row) => row[0] ?? 0),
        y: ones.map((row) => row[1] ?? 0),
        mode: 'markers',
        type: 'scatter',
        name: 'Class 1'
      }
    ],
    layout: {
      title,
      xaxis: { title: 'Feature 1' },
      yaxis: { title: 'Feature 2' }
    }
  };
}
