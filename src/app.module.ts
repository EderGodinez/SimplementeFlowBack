import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrdersModule } from './orders/orders.module';
import { EmailModule } from './email/email.module';
import { FilesModule } from './files/files.module';
@Module({
  imports: [
    AuthModule,//Users
    ConfigModule.forRoot({isGlobal:true}),
    MongooseModule.forRoot(process.env.MONGO_URL),
    ProductsModule,
    OrdersModule,
    EmailModule,
    FilesModule,
  ],
  providers: [EmailModule,ConfigService],
})
export class AppModule {}

