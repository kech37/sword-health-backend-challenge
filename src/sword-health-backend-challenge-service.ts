import express, { Express } from "express";
import { SetupController } from "./controllers/setup-controller";
import { DatabaseService } from "./services/database-service";

export class SwordHealthBackendChallengeService {
  private static instance?: SwordHealthBackendChallengeService;

  private httpService: Express;

  constructor() {
    this.httpService = express();
  }

  static getInstance(): SwordHealthBackendChallengeService {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new SwordHealthBackendChallengeService();
    return this.instance;
  }

  private setupControllers(): void {
    new SetupController(this.httpService);
  }

  async run(): Promise<void> {
    await DatabaseService.getInstance().run();
    this.setupControllers();

    this.httpService.listen(3000, () =>
      console.log(`Service listening on port: ${3000}`)
    );
  }
}
