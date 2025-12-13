import prisma, { Prisma } from '@monorepo/database';
import {
  AllShipments,
  ReportShipments,
  UserWithoutPassword,
} from '@monorepo/entities';
import {
  CreateOrUpdateShipmentSchema,
  ShipmentSearchResult,
  ShipmentSearchSchema,
} from '@monorepo/schemas';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  endOfMonth,
  endOfYear,
  startOfMonth,
  startOfYear,
  subMonths,
} from 'date-fns';

@Injectable()
export class ShipmentService {
  constructor() {}

  async searchShipments(
    user: UserWithoutPassword,
    data: ShipmentSearchSchema,
  ): Promise<ShipmentSearchResult> {
    const isSuperAdmin = user.isSuperAdmin;
    const limit = data.pageSize && data.pageSize <= 50 ? data.pageSize : 25;

    const whereQuery: Prisma.ShipmentWhereInput = {
      OR: data.search
        ? [
            {
              name: {
                contains: data.search,
                mode: 'insensitive',
              },
            },
            {
              jobsheetNo: {
                contains: data.search,
                mode: 'insensitive',
              },
            },
            {
              billOfLadingNo: {
                contains: data.search,
                mode: 'insensitive',
              },
            },
          ]
        : undefined,
      status: data.status ? data.status : undefined,
      userId: isSuperAdmin ? undefined : user.id,
    };

    const [shipments, count] = await prisma.$transaction([
      prisma.shipment.findMany({
        skip: (data.page - 1) * limit,
        take: limit,
        where: whereQuery,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: {
            select: {
              name: true,
            },
          },
          broker: {
            select: {
              name: true,
            },
          },
          customer: {
            select: {
              organization: true,
            },
          },
          shippingLine: {
            select: {
              organization: true,
            },
          },
        },
      }),
      prisma.shipment.count({ where: whereQuery }),
    ]);

    return {
      datas: shipments,
      meta: {
        page: data.page,
        totalPages: Math.ceil(count / limit),
        totalResources: count,
      },
    };
  }

  async getAll(user: UserWithoutPassword): Promise<AllShipments[]> {
    const isSuperAdmin = user.isSuperAdmin;
    const shipments = await prisma.shipment.findMany({
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

    return shipments;
  }

  async getReports(
    user: UserWithoutPassword,
    data: { select?: 'month' | '3-months' | 'year' },
  ): Promise<ReportShipments> {
    const isSuperAdmin = user.isSuperAdmin;

    const today = new Date();
    let gte: Date;
    let lte: Date = today;

    switch (data.select) {
      case '3-months':
        gte = startOfMonth(subMonths(today, 2));
        lte = today;
        break;

      case 'year':
        gte = startOfYear(today);
        lte = endOfYear(today);
        break;

      case 'month':
      default:
        gte = startOfMonth(today);
        lte = endOfMonth(today);
        break;
    }

    const resp = await prisma.shipment.findMany({
      where: {
        createdAt: {
          gte: gte,
          lt: lte,
        },
        userId: isSuperAdmin ? undefined : user.id,
      },
      select: {
        name: true,
        _count: {
          select: {
            cargos: true,
            trucking: true,
          },
        },
        trucking: {
          select: {
            fee: true,
          },
        },
      },
    });

    const total = resp.reduce(
      (acc, cur) => ({
        fee: acc.fee + cur.trucking.reduce((a, b) => a + b.fee, 0),
        trucking: acc.trucking + cur._count.trucking,
        cargo: acc.cargo + cur._count.cargos,
      }),
      { cargo: 0, fee: 0, trucking: 0 },
    );

    const shipments = resp.map((shipment) => ({
      name: shipment.name,
      cargos: shipment._count.cargos ?? 0,
      truckings: shipment._count.trucking ?? 0,
      fee: shipment.trucking.reduce((a, b) => a + b.fee, 0),
    }));

    return { shipments, total };
  }

  async create(user: UserWithoutPassword, data: CreateOrUpdateShipmentSchema) {
    const newShipment = await prisma.shipment.create({
      data: {
        ...data,
        userId: user.id,
      },
    });
    return newShipment;
  }

  async update(id: string, data: CreateOrUpdateShipmentSchema) {
    const shipment = await prisma.shipment.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!shipment) throw new NotFoundException('Shipment not found');

    const updatedShipment = await prisma.shipment.update({
      where: {
        id,
        userId: shipment.userId,
      },
      data: data,
    });

    return updatedShipment;
  }

  async delete(id: string) {
    const shipment = await prisma.shipment.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!shipment) throw new NotFoundException('Shipment not found');

    await prisma.shipment.delete({
      where: {
        id,
        userId: shipment.userId,
      },
    });
  }
}
