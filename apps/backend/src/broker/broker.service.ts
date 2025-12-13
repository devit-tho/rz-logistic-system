import { Prisma } from '@monorepo/database';
import { AllBrokers, UserWithoutPassword } from '@monorepo/entities';
import {
  BrokerSearchResult,
  BrokerSearchSchema,
  CreateOrUpdateBrokerSchema,
} from '@monorepo/schemas';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class BrokerService {
  constructor() {}

  async search(data: BrokerSearchSchema): Promise<BrokerSearchResult> {
    const limit = data.pageSize && data.pageSize <= 50 ? data.pageSize : 10;

    const whereQuery: Prisma.BrokerWhereInput = {
      name: data.search
        ? { contains: data.search, mode: 'insensitive' }
        : undefined,
    };

    const [brokers, count] = await prisma.$transaction([
      prisma.broker.findMany({
        where: whereQuery,
        take: limit,
        skip: (data.page - 1) * limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.broker.count({ where: whereQuery }),
    ]);

    return {
      datas: brokers,
      meta: {
        page: data.page,
        totalPages: Math.ceil(count / limit),
        totalResources: count,
      },
    };
  }

  async getAll(): Promise<AllBrokers[]> {
    const brokers = await prisma.broker.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    });
    return brokers;
  }

  async create(user: UserWithoutPassword, data: CreateOrUpdateBrokerSchema) {
    const newData = await prisma.broker.create({
      data: {
        ...data,
        userId: user.id,
      },
    });

    return newData;
  }

  async update(id: string, data: CreateOrUpdateBrokerSchema) {
    const broker = await prisma.broker.findUnique({
      where: {
        id,
      },
    });

    if (!broker) throw new NotFoundException('Broker not found');

    await prisma.broker.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: string) {
    const broker = await prisma.broker.findUnique({
      where: {
        id,
      },
    });

    if (!broker) throw new NotFoundException('Broker not found');

    await prisma.broker.delete({
      where: {
        id,
      },
    });
  }
}
