import { ContactModule } from '@/contact/contact.module';
import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

@Module({
  imports: [ContactModule],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
