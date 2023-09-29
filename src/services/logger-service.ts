import pino from 'pino';
import { LogLevel } from '../@types/log-level';

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

  setLogLevel(level: LogLevel): void {
    this.implementation.level = level;
  }
}
