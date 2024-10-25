export class BusinessException extends Error {
  public status: number;
  public message: string;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, BusinessException.prototype);
  }
}
