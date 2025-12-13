import { GetUser } from '@/decorators';
import { ZodValidationPipe } from '@/pipes/zod-validation.pipe';
import { UserWithoutPassword } from '@monorepo/entities';
import {
  CargoSearchSchema,
  cargoSearchSchema,
  createOrUpdateCargoSchema,
  CreateOrUpdateCargoSchema,
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
import { CargoService } from './cargo.service';

@Controller('cargo')
export class CargoController {
  constructor(private readonly cargoService: CargoService) {}

  @Get('search')
  async search(
    @Query(new ZodValidationPipe(cargoSearchSchema)) data: CargoSearchSchema,
    @GetUser() user: UserWithoutPassword,
  ) {
    return this.cargoService.search(user, data);
  }

  @Get('all')
  async getAll(@GetUser() user: UserWithoutPassword) {
    return this.cargoService.getAll(user);
  }

  @Post()
  async create(
    @GetUser() user: UserWithoutPassword,
    @Body(new ZodValidationPipe(createOrUpdateCargoSchema))
    data: CreateOrUpdateCargoSchema,
  ) {
    return this.cargoService.create(user, data);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body(new ZodValidationPipe(createOrUpdateCargoSchema))
    data: CreateOrUpdateCargoSchema,
  ) {
    return this.cargoService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: string) {
    return this.cargoService.delete(id);
  }
}
