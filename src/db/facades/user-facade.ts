import { baseService } from "../..";
import { DatabaseService } from "../../services/database-service";
import { LogService } from "../../services/log-service";
import { SwordHealthBackendChallengeService } from "../../sword-health-backend-challenge-service";
import { UserEntity } from "../entities/user-entity";

export class UserFacade {
  private static instance?: UserFacade;

  private readonly databaseService: DatabaseService;

  constructor(baseService: SwordHealthBackendChallengeService) {
    this.databaseService = baseService.databaseService;
  }

  static getInstace(bs?: SwordHealthBackendChallengeService): UserFacade {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new UserFacade(bs ?? baseService);
    return this.instance;
  }

  async get(): Promise<UserEntity[]> {
    // TODO init rep
    const userRep = this.databaseService
      .getDataSource()
      .getRepository(UserEntity);

    const result = await userRep.find();
    LogService.getInstance().debug({ result }, "get: result");

    return result;
  }
}
