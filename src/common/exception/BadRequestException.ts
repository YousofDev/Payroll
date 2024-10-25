import { BusinessException } from "@exception/BusinessException";

export class BadRequestException extends BusinessException {
  constructor(message: string = "Bad request") {
    super(400, message);
  }
}
