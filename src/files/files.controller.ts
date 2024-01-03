import { Controller, Get, Post , Param, UseInterceptors, Res, UploadedFiles, Delete } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express'
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs'

@Controller('files')
export class FilesController {
   private static allowedFileExtensions = ['.jpg', '.jpeg', '.png','.jfif']; // Agrega las extensiones permitidas
   private static maxFileSizeInBytes = 5 * 1024 * 1024; // 5 MB, ajusta este valor según tus necesidades
   private static filesName:string[]=[]
  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      storage: diskStorage({
        destination:__dirname+'/public', // Ruta relativa al directorio raíz del proyecto
        filename: (req, file, cb) => { // Asegúrate de definir tu tipo de cuerpo de solicitud
          const customname=uuidv4()+extname(file.originalname);
          FilesController.filesName.push(customname);
         // const index =FilesController.fileCounter++;
        //  const uniqueFileName = `${file.originalname}_${index}${extname(file.originalname)}`;
          return cb(null, customname);
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
  uploadFiles(@UploadedFiles() files: Express.Multer.File[] ):string {//,@Body() name:CreateFileDto
     if (!files || files.length === 0) {
       return JSON.stringify('Ningún archivo cargado.'+files.length);
     }

     if (files.length > 5) {
       return JSON.stringify('Se permiten hasta 5 archivos como máximo.');
     }
     const fileNames=FilesController.filesName
     FilesController.filesName=[]
    return JSON.stringify(`Archivos ${fileNames} cargados exitosamente.`);
  }
  @Get(':imageName')
  serveImage(@Param('imageName') imageName: string, @Res() res: Response) {
    // Obtén la ruta completa de la imagen
    const imagePath = join(__dirname,`\\public\\${imageName}`);

    // Envía la imagen al cliente
    res.sendFile(imagePath);
  }
  //endpoint para eliminacion de imagenes
@Delete(':imageName')
DeleteImage(@Param('imageName') imageName:string){
  const imagePath = join(__dirname,`\\public\\${imageName}`);
  // Verificar si el archivo existe antes de intentar eliminarlo
  if (fs.existsSync(imagePath)) {
    // Eliminar el archivo
    fs.unlinkSync(imagePath);
    return { message: `Imagen ${imageName} eliminada correctamente` };
  } else {
    return { message: `La imagen ${imageName} no existe` };
  }
}
}
