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
    ROOT_PASSWORD: env.get('database_root_password').required().asString(),
    DATABASE: env.get('database_database').required().asString(),
    ENCRYPTION_KEY: env.get('database_encryption_key').required().asString(),
  };

  static MESSAGE_BROKER = {
    HOST: env.get('message_broker_host').required().asString(),
    PORT: env.get('message_broker_port').required().asPortNumber(),
    USERNAME: env.get('message_broker_username').required().asString(),
    PASSWORD: env.get('message_broker_password').required().asString(),
    CHANNEL_NAME: env.get('message_broker_channel_name').default('main_channel').asString(),
    EXCHANGE_NAME: env.get('message_broker_exchange_name').default('notification').asString(),
    QUEUE_NAME: env.get('message_broker_queue_name').default('center').asString(),
  };

  static TOKEN_SCRET = env.get('token_secret').required().asString();
}
