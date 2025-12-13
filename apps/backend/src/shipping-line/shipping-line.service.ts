import { ContactService } from '@/contact/contact.service';
import prisma, { Prisma } from '@monorepo/database';
import { AllShippingLines, UserWithoutPassword } from '@monorepo/entities';
import {
  CreateOrUpdateShippingLineSchema,
  ShippingLineSearchResult,
  ShippingLineSearchSchema,
} from '@monorepo/schemas';
import { Injectable, NotFoundException } from '@nestjs/common';
@Injectable()
export class ShippingLineService {
  constructor(private readonly contactService: ContactService) {}

  async search(
    data: ShippingLineSearchSchema,
  ): Promise<ShippingLineSearchResult> {
    const limit = data.pageSize && data.pageSize <= 50 ? data.pageSize : 25;

    const whereQuery: Prisma.ShippingLineWhereInput = {
      OR: data.search
        ? [
            {
              organization: {
                contains: data.search,
                mode: 'insensitive',
              },
            },
            {
              contact: {
                name: {
                  contains: data.search,
                  mode: 'insensitive',
                },
              },
            },
            {
              email: {
                contains: data.search,
                mode: 'insensitive',
              },
            },
          ]
        : undefined,
      // userId: isSuperAdmin ? undefined : user.id,
    };

    const [shippingLines, count] = await prisma.$transaction([
      prisma.shippingLine.findMany({
        where: whereQuery,
        take: limit,
        skip: (data.page - 1) * limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          contact: true,
        },
      }),
      prisma.shippingLine.count({ where: whereQuery }),
    ]);

    return {
      datas: shippingLines,
      meta: {
        page: data.page,
        totalPages: Math.ceil(count / limit),
        totalResources: count,
      },
    };
  }

  async getAll(): Promise<AllShippingLines[]> {
    const shippingLines = await prisma.shippingLine.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        organization: true,
      },
    });
    return shippingLines;
  }

  async create(
    user: UserWithoutPassword,
    data: CreateOrUpdateShippingLineSchema,
  ) {
    const { organization, phone, code, address, email, website, fax, contact } =
      data;

    const contactId = await this.contactService.create(contact);

    const newShippingLine = await prisma.shippingLine.create({
      data: {
        organization,
        phone,
        code,
        address,
        email,
        website,
        fax,
        contactId,
        userId: user.id,
      },
    });

    return newShippingLine;
  }

  async update(id: string, data: CreateOrUpdateShippingLineSchema) {
    const { organization, phone, code, address, email, website, fax, contact } =
      data;

    const shippingLine = await prisma.shippingLine.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        contactId: true,
      },
    });

    if (!shippingLine) throw new NotFoundException('Shipping Line not found');

    await this.contactService.update(shippingLine.contactId, contact);

    await prisma.shippingLine.update({
      data: {
        organization,
        phone,
        code,
        address,
        email,
        website,
        fax,
      },
      where: {
        id: shippingLine.id,
      },
    });
  }
  async delete(id: string) {
    const shippingLine = await prisma.shippingLine.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!shippingLine) throw new NotFoundException('Shipping Line not found');

    await prisma.shippingLine.delete({
      where: {
        id: shippingLine.id,
      },
    });
  }
}
