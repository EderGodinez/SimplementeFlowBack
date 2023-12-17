import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrdersModule } from './orders/orders.module';
import { EmailModule } from './email/email.module';
import { FilesModule } from './files/files.module';
import { MessagesResolver } from './messages/messages.resolver';
import { MessagesModule } from './messages/messages.module';
@Module({
  imports: [
    AuthModule,//Users
    ConfigModule.forRoot({isGlobal:true}),
    MongooseModule.forRoot(process.env.MONGO_URL),
    ProductsModule,
    OrdersModule,
    EmailModule,
    FilesModule,
    MessagesModule,
  ],
  providers: [EmailModule,ConfigService, MessagesResolver],
})
export class AppModule {}

