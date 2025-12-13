import { GetUser } from '@/decorators';
import { ZodValidationPipe } from '@/pipes/zod-validation.pipe';
import { UserWithoutPassword } from '@monorepo/entities';
import {
  createOrUpdateCustomerSchema,
  CreateOrUpdateCustomerSchema,
  CustomerSearchSchema,
  customerSearchSchema,
} from '@monorepo/schemas';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CustomerService } from './customer.service';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('search')
  async search(
    @Query(new ZodValidationPipe(customerSearchSchema))
    data: CustomerSearchSchema,
  ) {
    return this.customerService.search(data);
  }
  2;
  @Get('all')
  async getAll() {
    return this.customerService.getAll();
  }

  // @Get(':id')
  // async getById(@Param('id') id: string) {}

  @Post()
  async create(
    @GetUser() user: UserWithoutPassword,
    @Body(new ZodValidationPipe(createOrUpdateCustomerSchema))
    data: CreateOrUpdateCustomerSchema,
  ) {
    return this.customerService.create(user, data);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body(new ZodValidationPipe(createOrUpdateCustomerSchema))
    data: CreateOrUpdateCustomerSchema,
  ) {
    return this.customerService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: string) {
    return this.customerService.delete(id);
  }
}
