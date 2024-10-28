import { Request, Response } from "express";
import { logger } from "@util/logger";
import { validate } from "@util/validate";
import { ResponseEntity } from "@util/ResponseEntity";
import { UserService } from "@app/service/UserService";
import { UserRegisterRequestDto } from "@app/dto/UserRegisterRequestDto";
import { UserLoginRequestDto } from "@app/dto/UserLoginRequestDto";
import { UserIdRequestDto } from "@app/dto/UserIdRequestDto";
import { UserAssignRoleRequestDto } from "@app/dto/UserAssignRoleRequestDto";

export class UserController {
  public constructor(private readonly userService: UserService) {
    logger.info("UserController initialized");
  }

  public async getAllUsers(req: Request, res: Response) {
    const users = await this.userService.getAllUsers();
    ResponseEntity.ok(res, users);
  }

  public async getUserById(req: Request, res: Response) {
    const { params } = await validate(UserIdRequestDto, req);
    const user = await this.userService.getUserById(params.id);
    ResponseEntity.ok(res, user);
  }

  public async register(req: Request, res: Response) {
    const { body } = await validate(UserRegisterRequestDto, req);
    await this.userService.register(body);
    ResponseEntity.created(res, { message: "User registered successfully" });
  }

  public async login(req: Request, res: Response) {
    const { body } = await validate(UserLoginRequestDto, req);
    const loginResponse = await this.userService.login(
      body.email,
      body.password
    );
    ResponseEntity.ok(res, loginResponse);
  }

  public async deleteUserById(req: Request, res: Response) {
    const { params } = await validate(UserIdRequestDto, req);
    await this.userService.deleteUserById(params.id);
    ResponseEntity.noContent(res);
  }

  public async assignRole(req: Request, res: Response) {
    const { body, params } = await validate(UserAssignRoleRequestDto, req);
    await this.userService.assignUserRole(body, params.id);
    ResponseEntity.ok(res);
  }
}
