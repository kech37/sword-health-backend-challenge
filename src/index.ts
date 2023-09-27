import "dotenv/config";
import "reflect-metadata"; // TODO
import { SwordHealthBackendChallengeService } from "./sword-health-backend-challenge-service";

SwordHealthBackendChallengeService.getInstance().run();
