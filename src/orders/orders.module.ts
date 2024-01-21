import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './entities/order.entity';
import { Product, ProductSchema } from 'src/products/entities/product.entity';
import { EmailModule } from 'src/email/email.module';
import { User, UserSchema } from 'src/auth/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { EmailService } from 'src/email/email.service';

@Module({
  imports:[ MongooseModule.forFeature([
    { name: Order.name, schema: OrderSchema },
    { name: Product.name, schema:  ProductSchema},
    {name:User.name,schema:UserSchema}
  ]),
  EmailModule
],
  controllers: [OrdersController],
  providers: [OrdersService,AuthService,EmailService],
})
export class OrdersModule {}
