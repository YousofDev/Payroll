import { BusinessException } from "@exception/BusinessException";

export class ServerErrorException extends BusinessException {
  constructor(message: string = "Internal server error") {
    super(500, message);
  }
}
