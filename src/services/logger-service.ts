import pino from 'pino';

export type LoggerInstance = pino.Logger;

export class LoggerService {
  private implementation: LoggerInstance;

  constructor(applicationName: string) {
    this.implementation = pino({
      name: applicationName,
      formatters: {
        level(level) {
          return { level };
        },
      },
      level: 'debug',
    });
  }

  get(name?: string): LoggerInstance {
    const instance = name ? this.implementation.child({ service: name }) : this.implementation;

    return instance;
  }

  /**
   * Set the log level to be used in the newly created instances
   * Valid values: "fatal" | "error" | "warn" | "info" | "debug" | "trace"
   */
  setLogLevel(level: string): void {
    this.implementation.level = level;
  }
}
