import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

import type { Vector } from '../base.js';
import { Ml4jsError } from '../errors.js';

export interface PlotlyTrace {
  x: number[];
  y: number[];
  mode: string;
  type: string;
  name: string;
}

export interface PlotlyLayout {
  title: string;
  xaxis: { title: string };
  yaxis: { title: string };
}

export interface PlotlyFigure {
  data: PlotlyTrace[];
  layout: PlotlyLayout;
}

function assertSameLength(x: Vector, y: Vector, predicted: Vector): void {
  if (x.length === 0 || y.length === 0 || predicted.length === 0) {
    throw new Ml4jsError('Plot inputs must not be empty.');
  }

  if (x.length !== y.length || x.length !== predicted.length) {
    throw new Ml4jsError('Plot inputs must have the same length.');
  }
}

function orderByX(x: Vector, y: Vector): { sortedX: Vector; sortedY: Vector } {
  const pairs = x.map((value, index) => ({ x: value, y: y[index] ?? 0 }));
  pairs.sort((left, right) => left.x - right.x);
  return {
    sortedX: pairs.map((pair) => pair.x),
    sortedY: pairs.map((pair) => pair.y)
  };
}

export function createRegressionFigure(
  x: Vector,
  actual: Vector,
  predicted: Vector,
  title = 'Regression Results'
): PlotlyFigure {
  assertSameLength(x, actual, predicted);
  const orderedPrediction = orderByX(x, predicted);

  return {
    data: [
      {
        x,
        y: actual,
        mode: 'markers',
        type: 'scatter',
        name: 'Actual'
      },
      {
        x: orderedPrediction.sortedX,
        y: orderedPrediction.sortedY,
        mode: 'lines',
        type: 'scatter',
        name: 'Predicted'
      }
    ],
    layout: {
      title,
      xaxis: { title: 'Feature' },
      yaxis: { title: 'Target' }
    }
  };
}

export function createPredictionFigure(
  actual: Vector,
  predicted: Vector,
  title = 'Actual vs Predicted'
): PlotlyFigure {
  if (actual.length === 0 || predicted.length === 0) {
    throw new Ml4jsError('Plot inputs must not be empty.');
  }

  if (actual.length !== predicted.length) {
    throw new Ml4jsError('Plot inputs must have the same length.');
  }

  const minimum = Math.min(...actual, ...predicted);
  const maximum = Math.max(...actual, ...predicted);

  return {
    data: [
      {
        x: actual,
        y: predicted,
        mode: 'markers',
        type: 'scatter',
        name: 'Predictions'
      },
      {
        x: [minimum, maximum],
        y: [minimum, maximum],
        mode: 'lines',
        type: 'scatter',
        name: 'Ideal Fit'
      }
    ],
    layout: {
      title,
      xaxis: { title: 'Actual' },
      yaxis: { title: 'Predicted' }
    }
  };
}

export function renderPlotlyHtml(figure: PlotlyFigure): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${figure.layout.title}</title>
    <script src="https://cdn.plot.ly/plotly-3.1.0.min.js"></script>
  </head>
  <body>
    <div id="plot" style="width:100%;max-width:960px;height:540px;margin:0 auto;"></div>
    <script>
      const figure = ${JSON.stringify(figure)};
      Plotly.newPlot('plot', figure.data, figure.layout, { responsive: true });
    </script>
  </body>
</html>`;
}

export async function writePlotlyHtml(
  outputPath: string,
  figure: PlotlyFigure
): Promise<void> {
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, renderPlotlyHtml(figure), 'utf8');
}
