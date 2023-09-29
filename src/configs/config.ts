import * as env from 'env-var';
import { LogLevel } from '../@types/log-level';

export class Config {
  static LOG_LEVEL: LogLevel = env.get('log_level').required().asEnum(Object.values(LogLevel));

  static JWT_LOG_LEVEL: LogLevel = env.get('jwt_log_level').default(LogLevel.SILENT).asEnum(Object.values(LogLevel));

  static HTTP_SERVER_PORT = env.get('http_server_port').required().asPortNumber();

  static DATABASE = {
    HOST: env.get('database_host').required().asString(),
    PORT: env.get('database_port').required().asPortNumber(),
    USERNAME: env.get('database_username').required().asString(),
    PASSWORD: env.get('database_password').required().asString(),
    DATABASE: env.get('database_database').required().asString(),
  };

  static TOKEN_SCRET = env.get('token_secret').required().asString();
}
