import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FirebaseStorageService } from './files.service';
import { AdminGuard } from 'src/guards/admin/admin.guard';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { User, UserSchema } from 'src/auth/entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/products/entities/product.entity';
import { EmailModule } from 'src/email/email.module';
@Module({
  imports:[AuthModule,
    EmailModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema:  ProductSchema},
    ])
  ],
  controllers: [FilesController],
  providers:[FirebaseStorageService,AdminGuard,AuthService]
})
export class FilesModule {}
