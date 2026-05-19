export class Ml4jsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Ml4jsError';
  }
}
