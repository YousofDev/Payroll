import { UserModel } from "@app/model/User";
import { UserRole } from "@config/constants";

export class UserResponseDto {
  id: number;
  firstName: string;
  lastName: string | null;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: UserModel) {
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.role = user.role;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
