import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FirebaseStorageService } from './files.service';
@Module({
  controllers: [FilesController],
  providers:[FirebaseStorageService]
})
export class FilesModule {}
