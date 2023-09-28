export class ApplicationError extends Error {
  errorCode: string;

  constructor(errorCode: string, message?: string, options?: ErrorOptions) {
    super(message, options);

    this.errorCode = errorCode;
  }
}
