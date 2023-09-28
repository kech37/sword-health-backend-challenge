import pino, { Logger } from "pino";

export class LogService {
  private static instance?: LogService;

  private logger: Logger;

  constructor() {
    this.logger = pino({
      formatters: {
        level(level) {
          return { level };
        },
      },
      level: "trace", // TODO PUT ON .env
    });
  }

  static getInstance(): LogService {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new LogService();
    return this.instance;
  }

  debug(obj: unknown, msg?: string): void {
    this.logger.debug(obj, msg);
  }

  warn(obj: unknown, msg?: string): void {
    this.logger.warn(obj, msg);
  }

  info(obj: unknown, msg?: string): void {
    this.logger.info(obj, msg);
  }

  error(obj: unknown, msg?: string): void {
    this.logger.error(obj, msg);
  }
}
