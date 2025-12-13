import { UseAdmin } from '@/guards/admin.guard';
import { PublicRoute } from '@/guards/jwt-auth.guard';
import { ZodValidationPipe } from '@/pipes/zod-validation.pipe';
import {
  CreateOrUpdateDriverSchema,
  createOrUpdateDriverSchema,
  DriverLoginSchema,
  driverLoginSchema,
  DriverSearchSchema,
  driverSearchSchema,
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
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { DriverService } from './driver.service';

@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Get('search')
  async searchDrivers(
    @Query(new ZodValidationPipe(driverSearchSchema)) query: DriverSearchSchema,
  ) {
    return this.driverService.searchDrivers(query);
  }

  @Get('all')
  async getAll() {
    return this.driverService.getAll();
  }

  @Post()
  async create(
    @Body(new ZodValidationPipe(createOrUpdateDriverSchema))
    data: CreateOrUpdateDriverSchema,
  ) {
    return this.driverService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body(new ZodValidationPipe(createOrUpdateDriverSchema))
    data: CreateOrUpdateDriverSchema,
  ) {
    return this.driverService.update(id, data);
  }

  @Delete(':id')
  @UseAdmin()
  async delete(@Param('id', ParseIntPipe) id: string) {
    return this.driverService.delete(id);
  }

  @PublicRoute()
  @Post('auth/login')
  async login(
    @Body(new ZodValidationPipe(driverLoginSchema)) data: DriverLoginSchema,
  ) {
    return this.driverService.login(data);
  }

  @Get('me')
  async getMe(@Req() req: Request) {
    return req.driver;
  }
}
