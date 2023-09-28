import * as env from 'env-var';
import { LogLevel } from '../@types/log-level';

// TODO add custom logging
export class Config {
  static LOG_LEVEL: LogLevel = env.get('log_level').required().asEnum(Object.values(LogLevel));

  static DATABASE = {
    HOST: env.get('database_host').required().asString(),
    PORT: env.get('database_port').required().asPortNumber(),
    USERNAME: env.get('database_username').required().asString(),
    PASSWORD: env.get('database_password').required().asString(),
    DATABASE: env.get('database_database').required().asString(),
  };
}
