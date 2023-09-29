import { v4 as uuidv4, validate } from 'uuid';

export class UuidUtils {
  static getUuid(): string {
    return uuidv4();
  }

  static isValid(str: string): boolean {
    return validate(str);
  }
}
