import { Express, Request, Response } from "express";
import { UserFacade } from "../db/facades/user-facade";

export class SetupController {
  constructor(webService: Express) {
    webService.get("/hello", this.getHello);
  }

  private async getHello(
    _request: Request,
    response: Response
  ): Promise<Response> {
    const result = await UserFacade.getInstace().get();

    // eslint-disable-next-line no-console
    console.log("DEBUG result", result);

    return response.status(200).send(result);
  }
}
