import { ContactModule } from '@/contact/contact.module';
import { Module } from '@nestjs/common';
import { ShippingLineController } from './shipping-line.controller';
import { ShippingLineService } from './shipping-line.service';

@Module({
  imports: [ContactModule],
  controllers: [ShippingLineController],
  providers: [ShippingLineService],
})
export class ShippingLineModule {}
