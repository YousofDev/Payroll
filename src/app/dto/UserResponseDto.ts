import { UserModel } from "@app/model/User";
import { UserRole } from "@config/constants";

export class UserResponseDto {
  id: number;
  firstName: string;
  lastName: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: UserModel) {
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.role = user.role;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
