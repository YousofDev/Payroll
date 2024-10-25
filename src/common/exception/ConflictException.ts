import { BusinessException } from "@exception/BusinessException";

export class ConflictException extends BusinessException {
  constructor(message: string = "Conflict occurred") {
    super(409, message);
  }
}
