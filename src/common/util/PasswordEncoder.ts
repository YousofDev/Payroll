import bcrypt from "bcrypt";
import { logger } from "@util/logger";

export class PasswordEncoder {
  public constructor() {
    logger.info("PasswordEncoder initialized");
  }
  async hash(plainText: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(plainText, salt);
  }

  async match(plainText: string, password: string) {
    return await bcrypt.compare(plainText, password);
  }
}
