import "dotenv/config";
import "reflect-metadata"; // TODO
import { SwordHealthBackendChallengeService } from "./sword-health-backend-challenge-service";

export const baseService = new SwordHealthBackendChallengeService();

export default {
  baseService: baseService.run(),
};
