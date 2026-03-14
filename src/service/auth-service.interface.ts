import type {
  LoginDto,
  RegisterDto,
  TokenPayload,
} from "@/dto/auth-service.dto";

export interface AuthService {
  login(dto: LoginDto): Promise<TokenPayload>;
  register(dto: RegisterDto): Promise<TokenPayload>;
}
