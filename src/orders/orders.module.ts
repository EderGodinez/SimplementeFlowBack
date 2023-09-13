import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './entities/order.entity';
import { User, UserSchema } from 'src/auth/entities/user.entity';

@Module({
  imports:[ MongooseModule.forFeature([
    { name: Order.name, schema: OrderSchema },
    { name: User.name, schema: UserSchema }
  ]),
],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
