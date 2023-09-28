import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './entities/order.entity';
import { Product, ProductSchema } from 'src/products/entities/product.entity';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports:[ MongooseModule.forFeature([
    { name: Order.name, schema: OrderSchema },
    { name: Product.name, schema:  ProductSchema},
  ]),
  EmailModule
],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
