import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Res, UploadedFiles } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express'
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@Controller('files')
export class FilesController {
   private static fileCounter=0
   private static allowedFileExtensions = ['.jpg', '.jpeg', '.png']; // Agrega las extensiones permitidas
   private static maxFileSizeInBytes = 5 * 1024 * 1024; // 5 MB, ajusta este valor según tus necesidades
  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      storage: diskStorage({
        destination:__dirname+'/public', // Ruta relativa al directorio raíz del proyecto
        filename: (req, file, cb) => {
          const body: CreateFileDto = req.body; // Asegúrate de definir tu tipo de cuerpo de solicitud
          const customName = body.ProductName; // Supongamos que 'customName' es el valor del body
          const index =FilesController.fileCounter++;
          const uniqueFileName = `${customName}_${index}${extname(file.originalname)}`;
          return cb(null, uniqueFileName);
        },
      }),
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
    }),
  )
  uploadFiles(@UploadedFiles() files: Express.Multer.File[], @Body() body:CreateFileDto ) {
    if (!files || files.length === 0) {
      return 'Ningún archivo cargado.'+files.length;
    }

    if (files.length > 5) {
      return 'Se permiten hasta 5 archivos como máximo.';
    }

    const fileNames = files.map((file) => file.filename);
    return `Archivos ${fileNames.join(', ')} cargados exitosamente.`;
  }
  @Get(':imageName')
  serveImage(@Param('imageName') imageName: string, @Res() res: Response) {
    // Obtén la ruta completa de la imagen
    const imagePath = join(__dirname,`\\public\\${imageName}`);

    // Envía la imagen al cliente
    res.sendFile(imagePath);
  }

}
