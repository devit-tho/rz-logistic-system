import { GetUser } from '@/decorators';
import { UseAdmin } from '@/guards/admin.guard';
import { ZodValidationPipe } from '@/pipes/zod-validation.pipe';
import { UserWithoutPassword } from '@monorepo/entities';
import {
  createOrUpdateShipmentSchema,
  CreateOrUpdateShipmentSchema,
  ShipmentSearchSchema,
  shipmentSearchSchema,
} from '@monorepo/schemas';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ShipmentService } from './shipment.service';

@Controller('shipment')
export class ShipmentController {
  constructor(private readonly shipmentService: ShipmentService) {}

  @Get('search')
  async searchShipments(
    @Query(new ZodValidationPipe(shipmentSearchSchema))
    query: ShipmentSearchSchema,
    @GetUser() user: UserWithoutPassword,
  ) {
    return this.shipmentService.searchShipments(user, query);
  }

  @Post('report')
  async getReports(
    @GetUser() user: UserWithoutPassword,
    @Body() data: { select?: 'month' | '3-months' | 'year' },
  ) {
    return this.shipmentService.getReports(user, data);
  }

  @Get('all')
  async getAll(@GetUser() user: UserWithoutPassword) {
    return this.shipmentService.getAll(user);
  }

  @Post()
  async create(
    @GetUser() user: UserWithoutPassword,
    @Body(new ZodValidationPipe(createOrUpdateShipmentSchema))
    data: CreateOrUpdateShipmentSchema,
  ) {
    return this.shipmentService.create(user, data);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body(new ZodValidationPipe(createOrUpdateShipmentSchema))
    data: CreateOrUpdateShipmentSchema,
  ) {
    return this.shipmentService.update(id, data);
  }

  @Delete(':id')
  @UseAdmin()
  async delete(@Param('id', ParseIntPipe) id: string) {
    return this.shipmentService.delete(id);
  }
}
