import { GetUser } from '@/decorators';
import { ZodValidationPipe } from '@/pipes/zod-validation.pipe';
import { UserWithoutPassword } from '@monorepo/entities';
import {
  createOrUpdateSupplierSchema,
  CreateOrUpdateSupplierSchema,
  SupplierSearchSchema,
  supplierSearchSchema,
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
import { SupplierService } from './supplier.service';
@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Get('search')
  async search(
    @Query(new ZodValidationPipe(supplierSearchSchema))
    data: SupplierSearchSchema,
  ) {
    return this.supplierService.search(data);
  }

  @Get('all')
  async getAll() {
    return this.supplierService.getAll();
  }

  // @Get(':id')
  // async getById(@Param('id') id: string) {}

  @Post()
  async create(
    @GetUser() user: UserWithoutPassword,
    @Body(new ZodValidationPipe(createOrUpdateSupplierSchema))
    data: CreateOrUpdateSupplierSchema,
  ) {
    return this.supplierService.create(user, data);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body(new ZodValidationPipe(createOrUpdateSupplierSchema))
    data: CreateOrUpdateSupplierSchema,
  ) {
    return this.supplierService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: string) {
    return this.supplierService.delete(id);
  }
}
