import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './entities/order.entity';
import { User, UserSchema } from 'src/auth/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports:[ MongooseModule.forFeature([
    { name: Order.name, schema: OrderSchema }
  ]),
],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
