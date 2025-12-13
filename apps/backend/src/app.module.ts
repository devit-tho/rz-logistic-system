import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { BrokerModule } from './broker/broker.module';
import { CargoModule } from './cargo/cargo.module';
import { envSchema } from './config/env.schema';
import { ContactModule } from './contact/contact.module';
import { CustomerModule } from './customer/customer.module';
import { DriverModule } from './driver/driver.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ShipmentModule } from './shipment/shipment.module';
import { ShippingLineModule } from './shipping-line/shipping-line.module';
import { SupplierModule } from './supplier/supplier.module';
import { TruckingModule } from './trucking/trucking.module';
import { UserModule } from './user/user.module';

@Global()
@Module({
  imports: [JwtModule],
  exports: [JwtModule],
})
export class GlobalModule {}

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env.production'],
      validate: (config) => envSchema.parse(config),
      isGlobal: true,
    }),
    GlobalModule,
    AuthModule,
    UserModule,
    ContactModule,
    BrokerModule,
    ShipmentModule,
    CustomerModule,
    CargoModule,
    SupplierModule,
    TruckingModule,
    ShipmentModule,
    ShippingLineModule,
    DriverModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
