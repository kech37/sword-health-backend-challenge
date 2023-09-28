import { Request, Response } from 'express';
import { BaseController } from '../base/base-controller';
import { UserFacade } from '../db/facades/user-facade';
import { WebMethod } from '../services/web-server-service';
import { SwordHealthBackendChallengeService } from '../sword-health-backend-challenge-service';
import { TypeUtils } from '../utils/type-utils';

export class SetupController extends BaseController<SwordHealthBackendChallengeService> {
  private readonly userFacade: UserFacade;

  constructor(service: SwordHealthBackendChallengeService) {
    super(service);
    this.userFacade = new UserFacade(this.service);

    this.service.getWebServer.on(WebMethod.GET, '/hello', this.getHello.bind(this));
  }

  private async getHello(_request: Request, response: Response): Promise<Response> {
    const { requestId } = response.locals;
    TypeUtils.assertUUID(requestId);

    this.logger.info({ requestId }, 'SetupController: getHello');

    const result = await this.userFacade.get(requestId);
    this.logger.debug({ requestId, result }, 'getHello: result');

    return response.status(200).send(result);
  }
}
