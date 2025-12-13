import prisma, { Prisma } from '@monorepo/database';
import {
  AllTruckingManagements,
  UserWithoutPassword,
} from '@monorepo/entities';
import {
  CreateOrUpdateTruckingSchema,
  TruckingSearchResult,
  TruckingSearchSchema,
} from '@monorepo/schemas';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class TruckingService {
  constructor() {}

  async search(
    user: UserWithoutPassword,
    data: TruckingSearchSchema,
  ): Promise<TruckingSearchResult> {
    const isSuperAdmin = user.isSuperAdmin;
    const limit = data.pageSize && data.pageSize <= 50 ? data.pageSize : 25;

    const whereQuery: Prisma.TruckingManagementWhereInput = {
      OR: data.search
        ? [
            {
              driver: {
                name: {
                  contains: data.search,
                  mode: 'insensitive',
                },
              },
            },
            {
              cargo: {
                name: {
                  contains: data.search,
                  mode: 'insensitive',
                },
              },
            },
            {
              shipment: {
                name: {
                  contains: data.search,
                  mode: 'insensitive',
                },
              },
            },
            {
              truckPlateNumber: {
                contains: data.search,
                mode: 'insensitive',
              },
            },
            {
              truckStandby: {
                contains: data.search,
                mode: 'insensitive',
              },
            },
          ]
        : undefined,
      userId: isSuperAdmin ? undefined : user.id,
    };

    const [truckings, count] = await prisma.$transaction([
      prisma.truckingManagement.findMany({
        where: whereQuery,
        take: limit,
        skip: (data.page - 1) * limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          cargo: {
            select: {
              name: true,
              quantity: true,
              containerNo: true,
              containerSealNumber: true,
              containerType: true,
              grossweight: true,
            },
          },
          supplier: {
            select: {
              organization: true,
            },
          },
          shipment: {
            select: {
              name: true,
            },
          },
          driver: {
            select: {
              name: true,
            },
          },
        },
      }),
      prisma.truckingManagement.count({ where: whereQuery }),
    ]);

    return {
      datas: truckings,
      meta: {
        page: data.page,
        totalPages: Math.ceil(count / limit),
        totalResources: count,
      },
    };
  }

  async getAll(user: UserWithoutPassword): Promise<AllTruckingManagements[]> {
    const isSuperAdmin = user.isSuperAdmin;
    const truckings = await prisma.truckingManagement.findMany({
      where: {
        userId: isSuperAdmin ? undefined : user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        truckPlateNumber: true,
        createdAt: true,
      },
    });
    return truckings;
  }

  async create(user: UserWithoutPassword, data: CreateOrUpdateTruckingSchema) {
    const newTrucking = await prisma.truckingManagement.create({
      data: {
        ...data,
        userId: user.id,
      },
    });

    return newTrucking;
  }

  async update(id: string, data: CreateOrUpdateTruckingSchema) {
    const trucking = await prisma.truckingManagement.findUnique({
      where: {
        id,
      },
    });

    if (!trucking) throw new NotFoundException('Trucking not found');

    await prisma.truckingManagement.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: string) {
    const trucking = await prisma.truckingManagement.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!trucking) throw new NotFoundException('Trucking not found');

    await prisma.truckingManagement.delete({
      where: {
        id: trucking.id,
      },
    });
  }

  async updateStatus(id: string) {}
}
