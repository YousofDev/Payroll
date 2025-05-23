import { BusinessException } from "@exception/BusinessException";

export class DatabaseException extends BusinessException {
  constructor(message: string = "Data processing error") {
    super(500, message);
  }
}
