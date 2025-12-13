import { ContactService } from '@/contact/contact.service';
import prisma, { Prisma } from '@monorepo/database';
import { AllSuppliers, UserWithoutPassword } from '@monorepo/entities';
import {
  CreateOrUpdateSupplierSchema,
  SupplierSearchResult,
  SupplierSearchSchema,
} from '@monorepo/schemas';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class SupplierService {
  constructor(private readonly contactService: ContactService) {}

  async search(data: SupplierSearchSchema): Promise<SupplierSearchResult> {
    const limit = data.pageSize && data.pageSize <= 50 ? data.pageSize : 25;

    const whereQuery: Prisma.SupplierWhereInput = {
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

    const [suppliers, count] = await prisma.$transaction([
      prisma.supplier.findMany({
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
      prisma.supplier.count({ where: whereQuery }),
    ]);

    return {
      datas: suppliers,
      meta: {
        page: data.page,
        totalPages: Math.ceil(count / limit),
        totalResources: count,
      },
    };
  }

  async getAll(): Promise<AllSuppliers[]> {
    const suppliers = await prisma.supplier.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        organization: true,
        createdAt: true,
      },
    });
    return suppliers;
  }

  async create(user: UserWithoutPassword, data: CreateOrUpdateSupplierSchema) {
    const { organization, address, email, phone, contact } = data;

    const contactId = await this.contactService.create(contact);

    const newData = await prisma.supplier.create({
      data: {
        organization,
        address,
        email,
        phone,
        contactId,
        userId: user.id,
      },
      include: {
        contact: true,
      },
    });

    return newData;
  }

  async update(id: string, data: CreateOrUpdateSupplierSchema) {
    const { organization, address, email, phone, contact } = data;

    const supplier = await prisma.supplier.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        contactId: true,
      },
    });

    if (!supplier) throw new NotFoundException('Supplier not found');

    await this.contactService.update(supplier.contactId, contact);

    await prisma.supplier.update({
      data: {
        organization,
        address,
        email,
        phone,
      },
      where: {
        id: supplier.id,
      },
    });
  }

  async delete(id: string) {
    const supplier = await prisma.supplier.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!supplier) throw new NotFoundException('Supplier not found');

    await prisma.supplier.delete({
      where: {
        id: supplier.id,
      },
    });
  }
}
