import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/auth/entities/user.entity';
//import { ConfigModule } from '@nestjs/config';

@Module({
  imports:[
    MongooseModule.forFeature([
    { name: User.name, schema: UserSchema }
  ]),],
  providers: [EmailService],
  exports: [EmailService], // Exporta el servicio
})
export class EmailModule {}
