export class ScraperError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ScraperError';
  }
}

export class DetailsProviderError extends ScraperError {
  constructor(message: string) {
    super(message);
    this.name = 'DetailsProviderError';
  }
}

export class EanProviderError extends ScraperError {
  constructor(message: string) {
    super(message);
    this.name = 'EanProviderError';
  }
}