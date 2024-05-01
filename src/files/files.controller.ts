import { Controller, Get, Post , Param, UseInterceptors, Res, UploadedFiles, Delete, UseGuards } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { FirebaseStorageService } from './files.service';
import { extname } from 'path';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/guards/admin/admin.guard';

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly firebaseStorageService: FirebaseStorageService) {}
  private static allowedFileExtensions = ['.jpg', '.jpeg', '.png','.jfif']; // Agrega las extensiones permitidas
  private static maxFileSizeInBytes = 10 * 1024 * 1024; // 5 MB, ajusta este valor según tus necesidades
  @ApiOperation({description:'Permite subir un archivo a servicio de firebase storage - se requiere token de administrador',summary:'Subir un arcivo de imagen a servidor'})
  @UseGuards(AdminGuard)
  @Post('/upload')
  @UseInterceptors(FilesInterceptor('files', 5, {
    fileFilter: (req, file, cb) => {
      const isValidExtension = FilesController.allowedFileExtensions.includes(extname(file.originalname).toLowerCase());
      if (!isValidExtension) {
        cb(new Error('Formato de archivo no permitido'), false);
      }
      if (file.size > FilesController.maxFileSizeInBytes) {
        return cb(new Error('El archivo es demasiado grande'), false);
      }
      cb(null, true);
    },
    limits: {
      fileSize: FilesController.maxFileSizeInBytes,
    },
  }))
  async uploadFile(@UploadedFiles() files: Express.Multer.File[]) {
    let fileResponse:any[]=[]
    try {
      await Promise.all(files.map(async (file) => {
        const fileName = `${uuidv4()}${extname(file.originalname)}`;
        const downloadURL = await this.firebaseStorageService.uploadFile(file, fileName);
        fileResponse.push({ name: file.originalname, type: file.mimetype, downloadURL });
      }));
      return {
        message: 'Images subidas correctamente a servidor',
        filesinfo:fileResponse
      };
    } catch (error) {
      throw new Error(`Error uploading file: ${error.message}`);
    }
  }
  @ApiOperation({
    description:'Permite eliminar un archivo a servicio de firebase storage - se requiere token de administrador',
    summary:'Eliminar un arcivo de imagen a servidor firebase'})
  @UseGuards(AdminGuard)
  @Delete('/:imageName')
  async deleteImage(@Param('imageName') imageName: string) {
    try {
      // Llama a una función en tu servicio de Firebase Storage para eliminar el archivo
      await this.firebaseStorageService.deleteFile(imageName);

      return { message: `Imagen eliminada correctamente` };
    } catch (error) {
      return { message: `Error eliminando archivo` };
    }
  }
}
