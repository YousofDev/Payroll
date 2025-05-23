import {
  UserAssignRoleRequestDto,
  UserAssignRoleRequestDtoType,
} from "./../dto/UserAssignRoleRequestDto";
import { NewUserModel, User, UserModel } from "@app/model/User";
import { UserRole } from "@config/constants";
import { DatabaseClient } from "@data/DatabaseClient";
import { logger } from "@util/logger";
import { eq } from "drizzle-orm";

export class UserRepository {
  private readonly db = DatabaseClient.getInstance().getConnection();

  public constructor() {}

  public async getAllUsers() {
    return await this.db.select().from(User);
  }

  public async createUser(newUserDto: NewUserModel): Promise<UserModel> {
    return await this.db
      .insert(User)
      .values(newUserDto)
      .returning()
      .then((rows) => rows[0]);
  }

  public async getUserByEmail(email: string): Promise<UserModel | null> {
    return await this.db
      .select()
      .from(User)
      .where(eq(User.email, email))
      .then((rows) => rows[0]);
  }

  public async getUserById(id: number): Promise<UserModel | null> {
    return await this.db
      .select()
      .from(User)
      .where(eq(User.id, id))
      .then((rows) => rows[0]);
  }

  public async assignUserRole(
    roleDto: UserAssignRoleRequestDtoType,
    id: number
  ) {
    await this.db
      .update(User)
      .set({ role: roleDto.role })
      .where(eq(User.id, id));
  }

  public async deleteUserById(id: number) {
    await this.db.delete(User).where(eq(User.id, id));
  }
}
