import { DatabaseService } from "../../services/database-service";
import { UserEntity } from "../entities/user-entity";

export class UserFacade {
  private static instance?: UserFacade;

  static getInstace(): UserFacade {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new UserFacade();
    return this.instance;
  }

  async get(): Promise<UserEntity[]> {
    // TODO init rep
    const userRep = DatabaseService.getInstance()
      .getDataSource()
      .getRepository(UserEntity);

    return userRep.find();
  }
}
