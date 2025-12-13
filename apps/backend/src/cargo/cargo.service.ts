import prisma, { Prisma } from '@monorepo/database';
import { AllCargos, UserWithoutPassword } from '@monorepo/entities';
import {
  CargoSearchResult,
  CargoSearchSchema,
  CreateOrUpdateCargoSchema,
} from '@monorepo/schemas';
import { Injectable, NotFoundException } from '@nestjs/common';
@Injectable()
export class CargoService {
  constructor() {}

  async search(
    user: UserWithoutPassword,
    data: CargoSearchSchema,
  ): Promise<CargoSearchResult> {
    const isSuperAdmin = user.isSuperAdmin;
    const limit = data.pageSize && data.pageSize <= 50 ? data.pageSize : 25;

    const whereQuery: Prisma.CargoWhereInput = {
      OR: data.search
        ? [
            {
              name: {
                contains: data.search,
                mode: 'insensitive',
              },
            },
            {
              shipment: {
                name: { contains: data.search, mode: 'insensitive' },
              },
            },
          ]
        : undefined,
      userId: isSuperAdmin ? undefined : user.id,
    };

    const [cargos, count] = await prisma.$transaction([
      prisma.cargo.findMany({
        where: whereQuery,
        take: limit,
        skip: (data.page - 1) * limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          shipment: {
            select: {
              name: true,
            },
          },
        },
      }),
      prisma.cargo.count({ where: whereQuery }),
    ]);

    return {
      datas: cargos,
      meta: {
        page: data.page,
        totalPages: Math.ceil(count / limit),
        totalResources: count,
      },
    };
  }

  async getAll(user: UserWithoutPassword): Promise<AllCargos[]> {
    const isSuperAdmin = user.isSuperAdmin;
    const cargos = await prisma.cargo.findMany({
      where: {
        userId: isSuperAdmin ? undefined : user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    });
    return cargos;
  }

  async create(user: UserWithoutPassword, data: CreateOrUpdateCargoSchema) {
    const newData = await prisma.cargo.create({
      data: {
        ...data,
        userId: user.id,
      },
    });

    return newData;
  }

  async update(id: string, data: CreateOrUpdateCargoSchema) {
    const cargo = await prisma.cargo.findUnique({
      where: {
        id,
      },
    });

    if (!cargo) throw new NotFoundException('Cargo not found');

    await prisma.cargo.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: string) {
    const cargo = await prisma.cargo.findUnique({
      where: {
        id,
      },
    });

    if (!cargo) throw new NotFoundException('Cargo not found');

    await prisma.cargo.delete({
      where: {
        id,
      },
    });
  }
}
