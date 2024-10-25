import { BusinessException } from "@exception/BusinessException";

export class AuthorizationException extends BusinessException {
  constructor(message: string = "Authorization failed") {
    super(403, message);
  }
}
