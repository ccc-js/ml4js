import type { Matrix, Regressor, Vector } from '../base.js';
import { Ml4jsError } from '../errors.js';

export interface PipelineTransformer {
  fit(features: Matrix): this;
  transform(features: Matrix): Matrix;
  fitTransform?(features: Matrix): Matrix;
}

export interface PipelineStep {
  name: string;
  transformer: PipelineTransformer;
}

export class Pipeline implements Regressor {
  constructor(
    private readonly steps: PipelineStep[],
    private readonly estimator: Regressor
  ) {
    if (this.estimator === undefined) {
      throw new Ml4jsError('Pipeline requires a final estimator.');
    }
  }

  fit(features: Matrix, target: Vector): this {
    const transformedFeatures = this.applyFitTransform(features);
    this.estimator.fit(transformedFeatures, target);
    return this;
  }

  predict(features: Matrix): Vector {
    return this.estimator.predict(this.applyTransform(features));
  }

  score(features: Matrix, target: Vector): number {
    return this.estimator.score(this.applyTransform(features), target);
  }

  private applyFitTransform(features: Matrix): Matrix {
    let currentFeatures = features;

    for (const step of this.steps) {
      if (step.name.length === 0) {
        throw new Ml4jsError('Pipeline step names must not be empty.');
      }

      currentFeatures =
        step.transformer.fitTransform?.(currentFeatures) ??
        step.transformer.fit(currentFeatures).transform(currentFeatures);
    }

    return currentFeatures;
  }

  private applyTransform(features: Matrix): Matrix {
    let currentFeatures = features;

    for (const step of this.steps) {
      currentFeatures = step.transformer.transform(currentFeatures);
    }

    return currentFeatures;
  }
}
