import { DriverJwtStrategy } from '@/auth/jwt.strategy';
import { TruckingModule } from '@/trucking/trucking.module';
import { Module } from '@nestjs/common';
import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';

@Module({
  imports: [TruckingModule],
  controllers: [DriverController],
  providers: [DriverService, DriverJwtStrategy],
})
export class DriverModule {}
