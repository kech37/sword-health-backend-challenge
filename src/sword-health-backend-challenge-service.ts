import express, { Express } from "express";
import { SetupController } from "./controllers/setup-controller";
import { DatabaseService } from "./services/database-service";
import { LogService } from "./services/log-service";

export class SwordHealthBackendChallengeService {
  httpService: Express;

  databaseService: DatabaseService;

  constructor() {
    this.httpService = express();
    this.databaseService = new DatabaseService();

    new SetupController(this.httpService);
  }

  async run() {
    await this.databaseService
      .run()
      .then(() =>
        this.httpService.listen(3000, () => {
          LogService.getInstance().debug(`Service listening on port: ${3000}`);
        })
      )
      .catch((error) =>
        LogService.getInstance().error(
          { error },
          "SwordHealthBackendChallengeService: run error"
        )
      );
  }
}
