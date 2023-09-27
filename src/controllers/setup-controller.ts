import { Express, Request, Response } from "express";

export class SetupController {
  constructor(webService: Express) {
    webService.get("/hello", this.getHello);
  }

  private async getHello(
    _request: Request,
    response: Response
  ): Promise<Response> {
    return response.status(200).send("Hello World!");
  }
}
