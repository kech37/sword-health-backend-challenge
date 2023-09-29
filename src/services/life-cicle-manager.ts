import { LoggerInstance, LoggerService } from './logger-service';

interface LifeCycleInterface {
  start(): PromiseLike<void>;
  stop(): PromiseLike<void>;
}

export class LifeCycleManager implements LifeCycleInterface {
  services: LifeCycleInterface[] = [];

  logger: LoggerInstance;

  signalForceStop = false;

  constructor(loggerService: LoggerService) {
    this.logger = loggerService.get(this.constructor.name);
  }

  addService<T extends LifeCycleInterface>(service: T): T {
    this.services.push(service);
    return service;
  }

  addServices(...service: LifeCycleInterface[]): void {
    this.services.push(...service);
  }

  async start(): Promise<void> {
    await Promise.all(
      this.services.map(async (e) => {
        await e.start();
      }),
    );
  }

  async stop(): Promise<void> {
    await Promise.all(
      this.services.reverse().map(async (e) => {
        await e.stop();
      }),
    );
  }

  catchSignals(): void {
    const signalHandler = (): void => {
      if (this.signalForceStop) {
        this.logger.error('Caught interrupt signal: forcing stop');
        process.exit(1);
      }

      this.logger.warn('Caught interrupt signal');

      this.signalForceStop = true;
      this.stop();
    };

    process.on('SIGINT', signalHandler);
    process.on('SIGTERM', signalHandler);
  }
}
