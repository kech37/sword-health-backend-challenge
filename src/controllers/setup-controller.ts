import { Express, Request, Response } from "express";
import { UserFacade } from "../db/facades/user-facade";
import { LogService } from "../services/log-service";

export class SetupController {
  constructor(httpService: Express) {
    httpService.get("/hello", this.getHello);
  }

  private async getHello(
    _request: Request,
    response: Response
  ): Promise<Response> {
    LogService.getInstance().info("SetupController: getHello");
    const result = await UserFacade.getInstace().get();

    LogService.getInstance().info({ result }, "getHello: result");
    return response.status(200).send(result);
  }
}
