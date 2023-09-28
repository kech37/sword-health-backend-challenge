import express, { Handler } from 'express';
import { Server } from 'http';
import { SwordHealthBackendChallengeService } from '../sword-health-backend-challenge-service';
import { LifeCycleManager } from './life-cicle-manager';

export enum WebMethod {
  POST = 'POST',
  GET = 'GET',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  HEAD = 'HEAD',
  PUT = 'PUT',
}

export class WebServerService extends LifeCycleManager {
  app = express();

  server?: Server;

  port: number;

  constructor(service: SwordHealthBackendChallengeService, port: number) {
    super(service.logger);
    this.port = port;
  }

  use(...handlers: Handler[]): WebServerService {
    this.logger.info({ handlersNumber: handlers.length }, 'WebServerService: use');
    this.app.use(handlers);

    return this;
  }

  on(method: WebMethod | string, path: string, ...handlers: Handler[]): WebServerService {
    this.logger.info({ port: this.port, method, path }, 'WebServerService: on');
    switch (method) {
      case WebMethod.GET:
        this.app.get(path, handlers);
        break;
      case WebMethod.POST:
        this.app.post(path, handlers);
        break;
      case WebMethod.PATCH:
        this.app.patch(path, handlers);
        break;
      case WebMethod.DELETE:
        this.app.delete(path, handlers);
        break;
      case WebMethod.HEAD:
        this.app.head(path, handlers);
        break;
      case WebMethod.PUT:
        this.app.put(path, handlers);
        break;
      default:
        throw new Error('Method not implemented.');
    }

    return this;
  }

  async start(): Promise<void> {
    this.logger.info('WebServerService: start');

    if (this.server) {
      throw Error(`Server is already running: port=${this.port}`);
    }

    this.server = this.app.listen(this.port, () => {
      this.logger.info({ port: this.port }, 'start: port');
    });
  }

  async stop(): Promise<void> {
    this.logger.info('WebServerService: stop');
    if (!this.server) {
      throw Error(`No server is running: port=${this.port}`);
    }
    this.logger.info({ port: this.port }, 'stop: port');

    this.server.close((error) => {
      if (error) {
        throw Error(`Failed to stop server: port=${this.port}`, {
          cause: error,
        });
      }
      this.server = undefined;
      this.logger.info({ port: this.port }, 'stop: server stopped');
    });
  }
}
