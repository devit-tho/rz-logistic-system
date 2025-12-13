import { CreateOrUpdateContactSchema } from '@monorepo/schemas';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ContactService {
  async create(data: CreateOrUpdateContactSchema) {
    const contact = await prisma.contact.create({
      data,
      select: {
        id: true,
      },
    });

    return contact.id;
  }

  async update(id: string, data: CreateOrUpdateContactSchema) {
    const contact = await prisma.contact.findUnique({
      where: {
        id,
      },
    });

    if (!contact) throw new Error('Contact not found');

    await prisma.contact.update({
      where: {
        id,
      },
      data,
    });
  }
}
