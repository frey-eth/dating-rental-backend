import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcryptjs';
import { firstValueFrom } from 'rxjs';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  User as AuthUser,
} from 'libs/generated/auth';
import type { UsersServiceClient } from 'libs/generated/users';

const SALT_ROUNDS = 10;
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

@Injectable()
export class AuthServiceService {
  private readonly logger = new Logger(AuthServiceService.name);
  private usersServiceClient: UsersServiceClient;

  constructor(
    @Inject('USERS_SERVICE') private readonly client: ClientGrpc,
    private readonly jwtService: JwtService,
  ) {}

  onModuleInit() {
    this.usersServiceClient =
      this.client.getService<UsersServiceClient>('UsersService');
  }

  private getErrorMessage(err: unknown): string {
    if (err && typeof err === 'object') {
      if (
        'details' in err &&
        typeof (err as { details: unknown }).details === 'string'
      )
        return (err as { details: string }).details;
      if ('message' in err)
        return String((err as { message: unknown }).message);
    }
    return String(err);
  }

  private toAuthUser(user: {
    id: string | number;
    name: string;
    email: string;
    role?: string;
  }): AuthUser {
    return {
      id: String(user.id),
      name: user.name,
      email: user.email,
      role: user.role ?? 'CLIENT',
    };
  }

  private async signTokens(payload: {
    sub: string;
    email: string;
    role: string;
  }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: ACCESS_TOKEN_EXPIRY }),
      this.jwtService.signAsync(
        { ...payload, type: 'refresh' },
        { expiresIn: REFRESH_TOKEN_EXPIRY },
      ),
    ]);
    return { accessToken, refreshToken };
  }

  async register(dto: RegisterRequest): Promise<RegisterResponse> {
    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);
    let created: {
      id: string | number;
      name: string;
      email: string;
      role?: string;
    };
    try {
      created = await firstValueFrom(
        this.usersServiceClient.createUser({
          name: dto.name,
          email: dto.email,
          password: hashedPassword,
        }),
      );
    } catch (err: unknown) {
      const msg = this.getErrorMessage(err);
      this.logger.warn(`register: users-service error: ${msg}`);
      if (msg.includes('already registered') || msg.includes('P2002')) {
        throw new RpcException({
          code: 6,
          message: 'Email already registered',
        });
      }
      throw new RpcException({
        code: 13,
        message: msg || 'User not created',
      });
    }
    const { accessToken, refreshToken } = await this.signTokens({
      sub: String(created.id),
      email: created.email,
      role: (created as { role?: string }).role ?? 'CLIENT',
    });
    return {
      user: this.toAuthUser(created),
      accessToken,
      refreshToken,
    };
  }

  async login(dto: LoginRequest): Promise<LoginResponse> {
    const user = await firstValueFrom(
      this.usersServiceClient.getUserByEmail({ email: dto.email }),
    ).catch(() => {
      throw new RpcException({
        code: 16,
        message: 'Invalid email or password',
      });
    });
    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new RpcException({
        code: 16,
        message: 'Invalid email or password',
      });
    }
    const { accessToken, refreshToken } = await this.signTokens({
      sub: String(user.id),
      email: user.email,
      role: (user as { role?: string }).role ?? 'CLIENT',
    });
    return {
      user: this.toAuthUser(user),
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(
    request: RefreshTokenRequest,
  ): Promise<RefreshTokenResponse> {
    try {
      const decoded = this.jwtService.verify<{
        sub: string;

        email: string;
        role: string;
        type?: string;
      }>(request.refreshToken);
      if (decoded.type !== 'refresh') {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const { accessToken, refreshToken } = await this.signTokens({
        sub: decoded.sub,
        email: decoded.email,
        role: decoded.role ?? 'CLIENT',
      });
      return { accessToken, refreshToken };
    } catch {
      throw new RpcException({
        code: 16,
        message: 'Invalid or expired refresh token',
      });
    }
  }
}
