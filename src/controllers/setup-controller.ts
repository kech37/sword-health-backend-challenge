import { Request, Response } from 'express';
import { BaseController } from '../base/base-controller';
import { UserFacade } from '../db/facades/user-facade';
import { WebMethod } from '../services/web-server-service';
import { SwordHealthBackendChallengeService } from '../sword-health-backend-challenge-service';

export class SetupController extends BaseController<SwordHealthBackendChallengeService> {
  constructor(service: SwordHealthBackendChallengeService) {
    super(service);

    this.service.getWebServer.on(WebMethod.GET, '/hello', this.getHello.bind(this));
  }

  private async getHello(_request: Request, response: Response): Promise<Response> {
    this.logger.info('SetupController: getHello');
    const result = await UserFacade.getInstace().get();
    this.logger.debug({ result }, 'getHello: result');
    return response.status(200).send(result);
  }
}
