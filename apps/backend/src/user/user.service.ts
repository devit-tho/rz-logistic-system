import { EnvSchema } from '@/config/env.schema';
import prisma, { Prisma } from '@monorepo/database';
import { UserWithoutPassword } from '@monorepo/entities';
import {
  ChangePasswordSchema,
  ChangeUserEmailSchema,
  CreateUserSchema,
  ResetPasswordSchema,
  UpdateUserSchema,
  UserSearchResult,
  UserSearchSchema,
} from '@monorepo/schemas';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

// ----------------------------------------------------------------------

export function encryptPassword(password: string) {
  return bcrypt.hashSync(password, 10);
}

export function comparePassword(password: string, hashPassword: string) {
  return bcrypt.compareSync(password, hashPassword);
}

@Injectable()
export class UserService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvSchema>,
  ) {}

  async search(data: UserSearchSchema): Promise<UserSearchResult> {
    const limit = data.pageSize && data.pageSize <= 50 ? data.pageSize : 25;

    const whereQuery: Prisma.UserWhereInput = {
      name: data.search
        ? { contains: data.search, mode: 'insensitive' }
        : undefined,
    };

    const [users, count] = await prisma.$transaction([
      prisma.user.findMany({
        where: whereQuery,
        take: limit,
        skip: (data.page - 1) * limit,
        orderBy: {
          createdAt: 'desc',
        },
        omit: {
          password: true,
        },
      }),
      prisma.user.count({ where: whereQuery }),
    ]);

    return {
      datas: users,
      meta: {
        page: data.page,
        totalPages: Math.ceil(count / limit),
        totalResources: count,
      },
    };
  }

  // async getAll() {
  //   const users = await prisma.user.findMany();
  //   return users;
  // }

  async getUserByEmail(email: string) {
    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
      },
    });

    return user;
  }

  async generateToken(userId: string) {
    const [accessToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
        },
        {
          secret: this.configService.get('JWT_SECRET'),
          expiresIn: this.configService.get('JWT_EXPIRES_IN'),
        },
      ),
    ]);

    return {
      accessToken,
    };
  }

  async create(dto: CreateUserSchema) {
    // Generate a random avatar url
    const randomId = Math.floor(Math.random() * 100000000);
    const avatarUrl = `https://avatars.githubusercontent.com/u/${randomId}`;

    const encryptedPassword = encryptPassword(dto.password);

    const newUser = await prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: encryptedPassword,
        imageUrl: avatarUrl,
      },
      omit: {
        password: true,
      },
    });

    return newUser;
  }

  async update(
    user: UserWithoutPassword,
    data: UpdateUserSchema,
  ): Promise<UserWithoutPassword> {
    const { name, email, imageUrl } = data;

    const notValidRole = !user.isSuperAdmin && user.email !== email;

    if (notValidRole) {
      throw new BadRequestException(
        'You are not allowed to change the email of a non-super admin user',
      );
    }

    const updateUser = await prisma.user.update({
      data: {
        name,
        imageUrl,
        ...(!notValidRole && { email }),
      },
      where: {
        id: user.id,
      },
      omit: {
        password: true,
      },
    });

    return updateUser;
  }

  async updateLastLogin(userId: string) {
    await prisma.user.update({
      data: {
        lastLogin: new Date(),
      },
      where: {
        id: userId,
      },
    });
  }

  async changeUserEmail(
    user: UserWithoutPassword,
    data: ChangeUserEmailSchema,
  ) {
    const { id, email, newEmail } = data;

    if (!user.isSuperAdmin) {
      throw new BadRequestException(
        'You are not allowed to change the email of a non-super admin user',
      );
    }

    const curUser = await prisma.user.findFirst({
      where: {
        id,
        email: {
          equals: email,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        email: true,
      },
    });

    if (!curUser) {
      throw new NotFoundException('User not found');
    }

    await prisma.user.update({
      data: {
        email: newEmail,
      },
      where: {
        id: curUser.id,
        email: curUser.email,
      },
    });
  }

  async changePassword(user: UserWithoutPassword, data: ChangePasswordSchema) {
    const { password, newPassword, confirmPassword } = data;

    const curUser = await prisma.user.findFirst({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        password: true,
      },
    });

    const comparedPassword = comparePassword(password, curUser.password);

    if (!comparedPassword) {
      throw new BadRequestException('Current password is incorrect');
    }

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const encryptedPassword = encryptPassword(newPassword);

    await prisma.user.update({
      data: {
        password: encryptedPassword,
      },
      where: {
        id: curUser.id,
      },
    });
  }

  async resetPassword(
    user: UserWithoutPassword,

    data: ResetPasswordSchema,
  ) {
    const { id, password } = data;

    if (!user.isSuperAdmin) {
      throw new BadRequestException(
        'You are not allowed to reset password of a non-super admin user',
      );
    }

    const encryptedPassword = encryptPassword(password);

    const curUser = await prisma.user.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!curUser) {
      throw new NotFoundException('User not found');
    }

    await prisma.user.update({
      data: {
        password: encryptedPassword,
      },
      where: {
        id,
      },
    });
  }
}
