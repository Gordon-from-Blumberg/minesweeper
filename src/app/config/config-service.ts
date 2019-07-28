import config from './config.json';

export class ConfigService {
  private static INSTANCE;

  static getInstance(): ConfigService {
    if (!this.INSTANCE) {
      this.INSTANCE = new ConfigService();
    }
    return this.INSTANCE;
  }

  private constructor() {}

  getConfig() {
    return config;
  }
}
