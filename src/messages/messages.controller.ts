import { Controller, Get, Post, Body, Param, Delete, ValidationPipe, UsePipes } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';

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
  @Get('Pendient')
  findAllPendient() {
    return this.messagesService.findPendient();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(id);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messagesService.remove(id);
  }
}
