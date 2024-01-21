import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './entities/product.entity';
import { User, UserSchema } from 'src/auth/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { EmailService } from 'src/email/email.service';

@Module({
  imports:[ 
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema:  ProductSchema},
    ]),
],
  controllers: [ProductsController],
  providers: [ProductsService,AuthService,EmailService],
})
export class ProductsModule {}
