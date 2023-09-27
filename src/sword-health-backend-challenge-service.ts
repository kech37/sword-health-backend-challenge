import express, { Express } from "express";
import { SetupController } from "./controllers/setup-controller";

export class SwordHealthBackendChallengeService {
  private httpService: Express;

  constructor() {
    this.httpService = express();
  }

  static getInstance(): SwordHealthBackendChallengeService {
    return new SwordHealthBackendChallengeService();
  }

  private setupControllers(): void {
    new SetupController(this.httpService);
  }

  run(): void {
    this.setupControllers();

    this.httpService.listen(3000, () =>
      console.log(`Service listening on port: ${3000}`)
    );
  }
}
