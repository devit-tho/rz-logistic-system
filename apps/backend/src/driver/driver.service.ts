import prisma, { Prisma } from '@monorepo/database';
import { AllDrivers, Driver } from '@monorepo/entities';
import {
  CreateOrUpdateDriverSchema,
  DriverLoginSchema,
  DriverSearchResult,
  DriverSearchSchema,
} from '@monorepo/schemas';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class DriverService {
  constructor() {}

  async searchDrivers(data: DriverSearchSchema): Promise<DriverSearchResult> {
    const limit = data.pageSize && data.pageSize <= 50 ? data.pageSize : 25;

    const whereQuery: Prisma.DriverWhereInput = {
      OR: data.search
        ? [{ name: { contains: data.search, mode: 'insensitive' } }]
        : undefined,
    };

    const [drivers, count] = await prisma.$transaction([
      prisma.driver.findMany({
        where: whereQuery,
        take: limit,
        skip: (data.page - 1) * limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.driver.count({ where: whereQuery }),
    ]);

    return {
      datas: drivers,
      meta: {
        page: data.page,
        totalPages: Math.ceil(count / limit),
        totalResources: count,
      },
    };
  }

  async getAll(): Promise<AllDrivers[]> {
    const drivers = await prisma.driver.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    });
    return drivers;
  }

  async findById(id: string): Promise<Driver> {
    const driver = await prisma.driver.findUnique({
      where: {
        id,
      },
    });

    if (!driver) throw new NotFoundException('Driver not found');

    return driver;
  }

  async create(data: CreateOrUpdateDriverSchema) {
    function generateRandomCode(length: number = 8): string {
      const chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';

      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
      }

      return result;
    }

    const newDriver = await prisma.driver.create({
      data: {
        ...data,
        code: generateRandomCode(),
      },
    });
    return newDriver;
  }

  async update(id: string, data: CreateOrUpdateDriverSchema) {
    const driver = await prisma.driver.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!driver) throw new NotFoundException('Driver not found');

    await prisma.driver.update({
      where: {
        id: driver.id,
      },
      data,
    });
  }

  async delete(id: string) {
    const driver = await prisma.driver.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!driver) throw new NotFoundException('Driver not found');

    await prisma.driver.delete({
      where: {
        id: driver.id,
      },
    });
  }

  async login(data: DriverLoginSchema) {
    const driver = await prisma.driver.findUnique({
      where: {
        code: data.code,
      },
      select: {
        id: true,
      },
    });

    if (!driver) throw new NotFoundException('Driver not found');

    return driver;
  }
}
