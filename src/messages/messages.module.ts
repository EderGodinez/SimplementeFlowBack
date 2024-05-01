import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './entities/message.entity';
import { AuthModule } from 'src/auth/auth.module';
import { User, UserSchema } from 'src/auth/entities/user.entity';
import { EmailModule } from 'src/email/email.module';
import { Product, ProductSchema } from 'src/products/entities/product.entity';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports:[ AuthModule,
    EmailModule,
    MongooseModule.forFeature([
    { name: Message.name, schema: MessageSchema },
    { name: User.name, schema: UserSchema },
    { name: Product.name, schema:  ProductSchema}
  ]),
],
  controllers: [MessagesController],
  providers: [MessagesService,AuthService],
})
export class MessagesModule {}

