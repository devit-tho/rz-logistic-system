import { GetUser } from '@/decorators';
import { ZodValidationPipe } from '@/pipes/zod-validation.pipe';
import { UserWithoutPassword } from '@monorepo/entities';
import {
  CreateOrUpdateTruckingSchema,
  createOrUpdateTruckingSchema,
  TruckingSearchSchema,
  truckingSearchSchema,
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
import { TruckingService } from './trucking.service';

@Controller('trucking')
export class TruckingController {
  constructor(private readonly truckingService: TruckingService) {}

  @Get('search')
  async search(
    @Query(new ZodValidationPipe(truckingSearchSchema))
    data: TruckingSearchSchema,
    @GetUser() user: UserWithoutPassword,
  ) {
    return this.truckingService.search(user, data);
  }

  @Get('all')
  async getAll(@GetUser() user: UserWithoutPassword) {
    return this.truckingService.getAll(user);
  }

  @Post()
  async create(
    @GetUser() user: UserWithoutPassword,
    @Body(new ZodValidationPipe(createOrUpdateTruckingSchema))
    data: CreateOrUpdateTruckingSchema,
  ) {
    return this.truckingService.create(user, data);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body(new ZodValidationPipe(createOrUpdateTruckingSchema))
    data: CreateOrUpdateTruckingSchema,
  ) {
    return this.truckingService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: string) {
    return this.truckingService.delete(id);
  }
}
