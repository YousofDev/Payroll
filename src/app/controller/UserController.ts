import { Request, Response } from "express";
import { validate } from "@util/validate";
import { ResponseEntity } from "@util/ResponseEntity";
import { UserService } from "@app/service/UserService";
import { UserRegisterRequestDto } from "@app/dto/request/UserRegisterRequestDto";
import { UserLoginRequestDto } from "@app/dto/request/UserLoginRequestDto";
import { UserAssignRoleRequestDto } from "@app/dto/request/UserAssignRoleRequestDto";
import { IdParamRequestDto } from "@app/dto/request/IdParamRequestDto";

export class UserController {
  public constructor(private readonly userService: UserService) {}

  public async register(req: Request, res: Response) {
    const { body } = await validate(UserRegisterRequestDto, req);
    const result = await this.userService.register(body);
    ResponseEntity.created(res, result);
  }

  public async login(req: Request, res: Response) {
    const { body } = await validate(UserLoginRequestDto, req);
    const loginResponse = await this.userService.login(body);
    ResponseEntity.ok(res, loginResponse);
  }

  public async getAllUsers(req: Request, res: Response) {
    const users = await this.userService.getAllUsers();
    ResponseEntity.ok(res, users);
  }

  public async getUserById(req: Request, res: Response) {
    const { params } = await validate(IdParamRequestDto, req);
    const user = await this.userService.getUserById(params.id);
    ResponseEntity.ok(res, user);
  }

   public async getUserByEmail(req: Request, res: Response) {
    const { params } = await validate(IdParamRequestDto, req);
    const user = await this.userService.getUserById(params.id);
    ResponseEntity.ok(res, user);
  }

  public async deleteUserById(req: Request, res: Response) {
    const { params } = await validate(IdParamRequestDto, req);
    await this.userService.deleteUserById(params.id);
    ResponseEntity.noContent(res);
  }

  public async assignRole(req: Request, res: Response) {
    const { body, params } = await validate(UserAssignRoleRequestDto, req);
    const result = await this.userService.assignUserRole(body, params.id);
    ResponseEntity.ok(res, result);
  }
}
