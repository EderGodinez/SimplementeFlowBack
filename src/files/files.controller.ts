import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Express,Response } from 'express'
import { diskStorage } from 'multer';
import { join } from 'path';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}
  
@UseInterceptors(
  FileInterceptor('file',{
    storage:diskStorage({
      destination:__dirname+'/public',
      filename:function(req,file,cb){
        file.originalname="demo.png";
        cb(null,file.originalname);
      }
    })
  })
)
  @Post('upload')
  uploadFile(@UploadedFile() file:Express.Multer.File) {
    return `Archivo ${file.filename} cargado exitosamente`  
  }
  @Get()
  findAll() {
    return this.filesService.findAll();
  }
  @Get(':imageName')
  serveImage(@Param('imageName') imageName: string, @Res() res: Response) {
    // Obtén la ruta completa de la imagen
    const imagePath = join(__dirname,`\\public\\${imageName}`);

    // Envía la imagen al cliente
    res.sendFile(imagePath);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.filesService.update(+id, updateFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesService.remove(+id);
  }
}
