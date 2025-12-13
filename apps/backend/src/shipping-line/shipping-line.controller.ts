import { GetUser } from '@/decorators';
import { ZodValidationPipe } from '@/pipes/zod-validation.pipe';
import { UserWithoutPassword } from '@monorepo/entities';
import {
  createOrUpdateShippingLineSchema,
  CreateOrUpdateShippingLineSchema,
  ShippingLineSearchSchema,
  shippingLineSearchSchema,
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
import { ShippingLineService } from './shipping-line.service';

@Controller('shipping-line')
export class ShippingLineController {
  constructor(private readonly shippingLineService: ShippingLineService) {}

  @Get('search')
  async search(
    @Query(new ZodValidationPipe(shippingLineSearchSchema))
    query: ShippingLineSearchSchema,
  ) {
    return this.shippingLineService.search(query);
  }

  @Get('all')
  async getAll() {
    return this.shippingLineService.getAll();
  }

  @Post()
  async create(
    @GetUser() user: UserWithoutPassword,
    @Body(new ZodValidationPipe(createOrUpdateShippingLineSchema))
    data: CreateOrUpdateShippingLineSchema,
  ) {
    return this.shippingLineService.create(user, data);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body(new ZodValidationPipe(createOrUpdateShippingLineSchema))
    data: CreateOrUpdateShippingLineSchema,
  ) {
    return this.shippingLineService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: string) {
    return this.shippingLineService.delete(id);
  }
}
