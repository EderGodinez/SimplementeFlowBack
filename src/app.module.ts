import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';
import { ConfigModule } from '@nestjs/config';
import { OrdersModule } from './orders/orders.module';
import { EmailModule } from './email/email.module';
import { FilesModule } from './files/files.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'public'), // Ruta a la carpeta que contiene tus archivos estáticos
    // }),
    AuthModule,//Users
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL),
    ProductsModule,
    OrdersModule,
    EmailModule,
    FilesModule],
  providers: [EmailModule],
})
export class AppModule {}
