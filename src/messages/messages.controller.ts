import { Controller, Get, Post, Body, Param, Delete, ValidationPipe, UsePipes, Query, Patch } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService ) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto);
  }
  @Get()
  findAll() {
    return this.messagesService.findAll();
  }
  //Obtener el total de mesages en base a el status
  @Get('Total')
  findAllPendient(@Query('status') status :string) {
    return this.messagesService.CountMessagesByStatus(status);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(id);
  }
  @Patch(':id')
  UpdateStatus(@Param('id') id: string,@Body() Message:Message){
    return this.messagesService.updateMessage(id,Message);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messagesService.remove(id);
  }
}
