import { BusinessException } from "@exception/BusinessException";

export class NotFoundException extends BusinessException {
  constructor(message: string = "Resource not found") {
    super(404, message);
  }
}
