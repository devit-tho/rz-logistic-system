import { Module } from '@nestjs/common';
import { TruckingController } from './trucking.controller';
import { TruckingService } from './trucking.service';

@Module({
  controllers: [TruckingController],
  providers: [TruckingService],
})
export class TruckingModule {}
