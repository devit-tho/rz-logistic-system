import { UserService } from '@/user/user.service';
import prisma from '@monorepo/database';
import { LoginResponse, UserWithoutPassword } from '@monorepo/entities';
import { LoginSchema } from '@monorepo/schemas';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

// ----------------------------------------------------------------------

export function encryptPassword(password: string) {
  return bcrypt.hashSync(password, 8);
}

export function comparePassword(password: string, hashPassword: string) {
  return bcrypt.compareSync(password, hashPassword);
}

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  private MAX_ATTEMPTS = 5;
  private LOCK_DURATION = 15 * 60 * 1000; // 15 minutes

  async login(data: LoginSchema): Promise<LoginResponse> {
    const errorMessage = 'Incorrect email or password';

    const user = await this.userService.getUserByEmail(data.email);

    if (!user) {
      throw new UnauthorizedException(errorMessage);
    }

    if (user.lockedUntil && new Date() < new Date(user.lockedUntil)) {
      const unlockTime = new Date(user.lockedUntil).toLocaleTimeString();
      throw new ForbiddenException(
        `Account locked. Try again after ${unlockTime}`,
      );
    }

    const match = comparePassword(data.password, user.password);

    if (!match) {
      const attempts = user.loginAttempts + 1;
      const updateData: Pick<
        Partial<UserWithoutPassword>,
        'lockedUntil' | 'loginAttempts'
      > = { loginAttempts: attempts };

      if (attempts >= this.MAX_ATTEMPTS) {
        updateData.lockedUntil = new Date(Date.now() + this.LOCK_DURATION);
        updateData.loginAttempts = 0;
      }

      await prisma.user.update({
        where: { id: user.id },
        data: updateData,
      });

      throw new UnauthorizedException(errorMessage);
    }

    if (user.loginAttempts > 0 || user.lockedUntil) {
      await prisma.user.update({
        where: { id: user.id },
        data: { loginAttempts: 0, lockedUntil: null },
      });
    }

    const token = await this.userService.generateToken(user.id);

    await this.userService.updateLastLogin(user.id);

    await prisma.token.create({
      data: {
        userId: user.id,
        token: token.accessToken,
      },
    });

    return {
      user,
      token: token.accessToken,
    };
  }

  async logout(token: string) {
    await prisma.token.delete({
      where: {
        token,
      },
    });
  }

  async validate(token: string): Promise<UserWithoutPassword> {
    const res = await prisma.token.findUnique({
      where: { token },
      select: {
        user: {
          omit: {
            password: true,
          },
        },
      },
    });

    if (!res || !res.user) {
      throw new UnauthorizedException();
    }

    if (res.user.lockedUntil && new Date() < new Date(res.user.lockedUntil)) {
      throw new ForbiddenException('Account locked. Please contact support.');
    }

    return res.user;
  }
}
