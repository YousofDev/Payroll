import { UserModel } from "@app/model/User";
import { UserRole } from "@config/constants";

export class UserLoginResponseDto {
  constructor(private accessToken: string) {}
}
