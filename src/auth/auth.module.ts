import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
//import { ConfigModule } from '@nestjs/config';
import { EmailModule } from 'src/email/email.module';
import { Product, ProductSchema } from 'src/products/entities/product.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    MongooseModule.forFeature([
    { name: User.name, schema: UserSchema },
    { name: Product.name, schema:  ProductSchema},
  ]),
  JwtModule.register({
     global: true,
     secret: process.env.JWT_SECRET,
     signOptions: { expiresIn: '6h' },
   }),
  //  JwtModule.register({
  //   global: true,
  //   secret: process.env.JWT_ADMIN,
  //   signOptions: { expiresIn: '1h' },
  // }),
  EmailModule
  ]
})
export class AuthModule {}
