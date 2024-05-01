import { Controller, Get, Post, Body, Param, Delete, ValidationPipe, UsePipes, Query, Patch, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/guards/admin/admin.guard';
import { UpdateMessage } from './dto/UpdateMessage.dto';

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService ) {}
  
  @ApiOperation({
    description:'Toma como entrada toda la informacion importante de una duda de un cliente',
    summary:'Crear un nuevo mensaje'
  })
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto);
  }
  @ApiOperation({
    description:'Toma como entrada toda la informacion importante de una duda de un cliente',
    summary:'Permite obtener el listado de todos los mensajes'
  })
  @UseGuards(AdminGuard)
  @Get()
  findAll() {
    return this.messagesService.findAll();
  }
  @ApiOperation({
    description:'Retorna la suma de los deacuerdo a estatus que puede pendiente o Leido',
    summary:'Obtener la suma de todos los mensajes deacuerdo a su status'
  })
  @UseGuards(AdminGuard)
  //Obtener el total de mesages en base a el status
  @Get('Total')
  findAllPendient(@Query('status') status :string) {
    return this.messagesService.CountMessagesByStatus(status);
  }
  @ApiOperation({
    description:'Permite obtener el mesaje de un cliente de acuerdo al id del mismo',
    summary:'Permite obtener todos los detalles de un solo mensaje'
  })
  @UseGuards(AdminGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(id);
  }
  @ApiOperation({
    description:'Permite actualizar el estado del mensaje a `leido`',
    summary:'Actualizar estado de mensaje'
  })
  @UseGuards(AdminGuard)
  @Patch(':id')
  UpdateStatus(@Param('id') id: string,@Body() Message:UpdateMessage){
    return this.messagesService.updateMessage(id,Message);
  }
  @ApiOperation({
    description:'Permite eliminar el mensaje de la base de datos',
    summary:'Eliminar un mensaje'
  })
  @UseGuards(AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messagesService.remove(id);
  }
}
