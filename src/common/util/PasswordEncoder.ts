import bcrypt from "bcryptjs";

export class PasswordEncoder {
  public constructor() {}
  public async hash(plainText: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(plainText, salt);
  }

  public async match(plainText: string, password: string) {
    return await bcrypt.compare(plainText, password);
  }
}
