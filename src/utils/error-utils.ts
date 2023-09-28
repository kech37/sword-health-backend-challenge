import { SpecificErrorDescription } from '../@types/specific-error-description';
import { ApplicationError } from '../errors/models/application-error';

export class ErrorUtils {
  static createApplicationError(specificErrorDescription: SpecificErrorDescription, error?: unknown): ApplicationError {
    return new ApplicationError(specificErrorDescription.code.toString(), specificErrorDescription.description, {
      cause: error,
    });
  }
}
