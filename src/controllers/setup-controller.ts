import { Request, Response } from 'express';
import { WebMethod } from '../@types/web-method';
import { BaseController } from '../base/base-controller';
import { UserFacade } from '../db/facades/user-facade';
import { AppSingletonErrors } from '../errors/generic/app-errors';
import { SwordHealthBackendChallengeService } from '../sword-health-backend-challenge-service';
import { ErrorUtils } from '../utils/error-utils';
import { TypeUtils } from '../utils/type-utils';
import { JwtAuthenticationMiddleware } from './middlewares/jwt-authentication-middleware';

export class SetupController extends BaseController<SwordHealthBackendChallengeService> {
  private static instace?: SetupController;

  private constructor(service: SwordHealthBackendChallengeService) {
    super(service);

    this.service.getWebServer.on(
      WebMethod.GET,
      '/hello',
      JwtAuthenticationMiddleware,
      this.errorFactory((req, res) => SetupController.getInstance().getHello(req, res)),
    );
  }

  static getInstance(service?: SwordHealthBackendChallengeService): SetupController {
    if (this.instace) {
      return this.instace;
    }
    if (!service) {
      throw ErrorUtils.createApplicationError(AppSingletonErrors.ServiceNotDefined);
    }
    this.instace = new SetupController(service);
    return this.instace;
  }

  private async getHello(_request: Request, response: Response): Promise<Response> {
    const { requestId, jwtPayload } = response.locals;
    TypeUtils.assertUUID(requestId);
    TypeUtils.assertJwtPayload(jwtPayload);

    this.logger.info({ requestId }, 'SetupController: getHello');

    const result = await UserFacade.getInstance(this.service).get(requestId);
    this.logger.debug({ requestId, result }, 'getHello: result');

    return response.status(200).send({ result, jwtPayload });
  }
}
