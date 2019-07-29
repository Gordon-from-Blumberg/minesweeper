import config from './config.json';

/**
 * This class provides config
 * In this test task it gets the data from config.json
 * But in real application it may use requests to server and localStorage
 * Singleton
 */
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
