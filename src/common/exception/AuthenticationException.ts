import { BusinessException } from "@exception/BusinessException";

export class AuthenticationException extends BusinessException {
  constructor(message: string = "Authentication failed") {
    super(401, message);
  }
}
