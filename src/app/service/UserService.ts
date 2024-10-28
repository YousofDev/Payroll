import { UserAssignRoleRequestDtoType } from "@app/dto/UserAssignRoleRequestDto";
import { UserLoginResponseDto } from "@app/dto/UserLoginResponseDto";
import { UserResponseDto } from "@app/dto/UserResponseDto";
import { NewUserModel } from "@app/model/User";
import { UserRepository } from "@app/repository/UserRepository";
import { AuthenticationException } from "@exception/AuthenticationException";
import { ConflictException } from "@exception/ConflictException";
import { NotFoundException } from "@exception/NotFoundException";
import { JwtUtil } from "@util/JwtUtil";
import { logger } from "@util/logger";
import { PasswordEncoder } from "@util/PasswordEncoder";

export class UserService {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtUtil: JwtUtil,
    private readonly passwordEncoder: PasswordEncoder
  ) {
    logger.info("UserService initialized");
  }

  public async getAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.getAllUsers();
    return users.map((user) => new UserResponseDto(user));
  }

  public async register(userDto: NewUserModel) {
    const userExists = await this.userRepository.getUserByEmail(userDto.email);
    if (userExists) {
      throw new ConflictException(
        "Email " + userDto.email + " already registered"
      );
    }

    const hashedPassword = await this.passwordEncoder.hash(userDto.password);

    await this.userRepository.createUser({
      ...userDto,
      password: hashedPassword,
    });
  }

  public async login(
    email: string,
    password: string
  ): Promise<UserLoginResponseDto> {
    const user = await this.userRepository.getUserByEmail(email);

    if (!user) {
      throw new AuthenticationException("Invalid email or password");
    }

    const isValidPassword = await this.passwordEncoder.match(
      password,
      user.password
    );

    if (!isValidPassword) {
      throw new AuthenticationException("Invalid email or password");
    }

    const accessToken = await this.jwtUtil.generateAccessToken(user.email);

    return new UserLoginResponseDto(accessToken);
  }

  public async getUserByEmail(email: string) {
    return await this.userRepository.getUserByEmail(email);
  }

  public async getUserById(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} does not exists`);
    }
    return new UserResponseDto(user);
  }

  public async assignUserRole(
    roleDto: UserAssignRoleRequestDtoType,
    id: number
  ) {
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} does not exists`);
    }

    await this.userRepository.assignUserRole(roleDto, id);
  }

  public async deleteUserById(id: number) {
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} does not exists`);
    }
    await this.userRepository.deleteUserById(id);
  }
}
