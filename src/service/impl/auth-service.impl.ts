import { TYPES } from "@/di/types";
import type { AuthService } from "../auth-service.interface";
import { inject, injectable } from "inversify";
import type { JwtService } from "../jwt-service.interface";
import { randomUUID } from "crypto";
import { ConflictError, InternalError, UnauthorizedError } from "@/errors";
import type {
  LoginDto,
  RegisterDto,
  TokenPayload,
} from "@/dto/auth-service.dto";
import type { UserRepository } from "@/repository/user-repository.interface";
import type { JwtPayload } from "@/dto/jwt-service.dto";
import { Role } from "@/db/schema";

@injectable()
export class AuthServiceImpl implements AuthService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: UserRepository,
    @inject(TYPES.JwtService) private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<TokenPayload> {
    const existingUser = await this.userRepository.findByEmail(dto.email);

    if (!existingUser) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isValidPassword = await Bun.password.verify(
      dto.password,
      existingUser.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const payload: JwtPayload = {
      sub: existingUser.id,
      role: existingUser.role as Role,
    };

    const token = await this.jwtService.signToken(payload);

    return { token };
  }

  async register(dto: RegisterDto): Promise<TokenPayload> {
    const existingUser = await this.userRepository.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictError("User with this email already exists");
    }

    const hashedPassword = await Bun.password.hash(dto.password);

    const created = await this.userRepository.create({
      id: randomUUID(),
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    });

    if (!created) {
      throw new InternalError("Failed to create user");
    }

    const payload: JwtPayload = {
      sub: created.id,
      role: created.role as Role,
    };

    const token = await this.jwtService.signToken(payload);

    return { token };
  }
}
