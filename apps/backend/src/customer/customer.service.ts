import { ContactService } from '@/contact/contact.service';
import { Prisma } from '@monorepo/database';
import { AllCustomers, UserWithoutPassword } from '@monorepo/entities';
import {
  CreateOrUpdateCustomerSchema,
  CustomerSearchResult,
  CustomerSearchSchema,
} from '@monorepo/schemas';
import { Injectable, NotFoundException } from '@nestjs/common';
@Injectable()
export class CustomerService {
  constructor(private readonly contactService: ContactService) {}

  async search(data: CustomerSearchSchema): Promise<CustomerSearchResult> {
    const limit = data.pageSize && data.pageSize <= 50 ? data.pageSize : 25;

    const whereQuery: Prisma.CustomerWhereInput = {
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

    const [customers, count] = await prisma.$transaction([
      prisma.customer.findMany({
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
      prisma.customer.count({ where: whereQuery }),
    ]);

    return {
      datas: customers,
      meta: {
        page: data.page,
        totalPages: Math.ceil(count / limit),
        totalResources: count,
      },
    };
  }

  async getAll(): Promise<AllCustomers[]> {
    const customers = await prisma.customer.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        organization: true,
        createdAt: true,
      },
    });
    return customers;
  }

  async create(user: UserWithoutPassword, data: CreateOrUpdateCustomerSchema) {
    const { organization, email, phone, address, contact } = data;

    const contactId = await this.contactService.create(contact);

    const newData = await prisma.customer.create({
      data: {
        organization,
        email,
        phone,
        address,
        contactId,
        userId: user.id,
      },
      include: {
        contact: true,
      },
    });

    return newData;
  }

  async update(id: string, data: CreateOrUpdateCustomerSchema) {
    const { organization, email, phone, address, contact } = data;

    const customer = await prisma.customer.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        contactId: true,
      },
    });

    if (!customer) throw new NotFoundException('Customer not found');

    await this.contactService.update(customer.contactId, contact);

    await prisma.customer.update({
      data: { organization, email, phone, address },
      where: {
        id: customer.id,
      },
    });
  }

  async delete(id: string) {
    const customer = await prisma.customer.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!customer) throw new NotFoundException('Customer not found');

    await prisma.customer.delete({
      where: {
        id: customer.id,
      },
    });
  }
}
