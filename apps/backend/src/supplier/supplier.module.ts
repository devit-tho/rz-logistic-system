import { ContactModule } from '@/contact/contact.module';
import { Module } from '@nestjs/common';
import { SupplierController } from './supplier.controller';
import { SupplierService } from './supplier.service';

@Module({
  imports: [ContactModule],
  controllers: [SupplierController],
  providers: [SupplierService],
})
export class SupplierModule {}
