import { Config } from './config';

export const DatabaseEncryptionTransformerConfig = {
  key: Config.DATABASE.ENCRYPTION_KEY,
  algorithm: 'aes-256-gcm',
  ivLength: 16,
};
