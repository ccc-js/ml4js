import type { Matrix, Vector } from '../base.js';
import { Ml4jsError } from '../errors.js';
import type { PlotlyFigure } from './regression.js';

export function createClusterFigure(
  features: Matrix,
  labels: Vector,
  title = 'Cluster Results'
): PlotlyFigure {
  if (features.length === 0 || labels.length === 0) {
    throw new Ml4jsError('Plot inputs must not be empty.');
  }

  if (features.length !== labels.length) {
    throw new Ml4jsError('Plot inputs must have the same length.');
  }

  if ((features[0]?.length ?? 0) < 2) {
    throw new Ml4jsError('Cluster plot requires at least 2 feature columns.');
  }

  const uniqueLabels = [...new Set(labels)];
  return {
    data: uniqueLabels.map((label) => {
      const rows = features.filter((_, index) => labels[index] === label);
      return {
        x: rows.map((row) => row[0] ?? 0),
        y: rows.map((row) => row[1] ?? 0),
        mode: 'markers',
        type: 'scatter',
        name: `Cluster ${label}`
      };
    }),
    layout: {
      title,
      xaxis: { title: 'Component 1' },
      yaxis: { title: 'Component 2' }
    }
  };
}
