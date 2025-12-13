import { GetUser } from '@/decorators';
import { ZodValidationPipe } from '@/pipes/zod-validation.pipe';
import { UserWithoutPassword } from '@monorepo/entities';
import {
  brokerSearchSchema,
  BrokerSearchSchema,
  createOrUpdateBrokerSchema,
  CreateOrUpdateBrokerSchema,
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
import { BrokerService } from './broker.service';

@Controller('broker')
export class BrokerController {
  constructor(private readonly brokerService: BrokerService) {}

  @Get('search')
  async search(
    @Query(new ZodValidationPipe(brokerSearchSchema)) query: BrokerSearchSchema,
  ) {
    return this.brokerService.search(query);
  }

  @Get('all')
  async getAll() {
    return this.brokerService.getAll();
  }

  // @Get(':id')
  // async getById(@Param('id') id: string) {}

  @Post()
  async create(
    @GetUser() user: UserWithoutPassword,
    @Body(new ZodValidationPipe(createOrUpdateBrokerSchema))
    data: CreateOrUpdateBrokerSchema,
  ) {
    return this.brokerService.create(user, data);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body(new ZodValidationPipe(createOrUpdateBrokerSchema))
    data: CreateOrUpdateBrokerSchema,
  ) {
    return this.brokerService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: string) {
    return this.brokerService.delete(id);
  }
}
