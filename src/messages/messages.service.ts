import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './entities/message.entity';
import { Model } from 'mongoose';

@Injectable()
export class MessagesService {
  constructor(@InjectModel(Message.name)
  private MessageModel: Model<Message>){}
  create(createMessageDto: CreateMessageDto) {
    return this.MessageModel.create(createMessageDto)
  }
  async findAll() {
    try {
      const messages=await this.MessageModel.find()
      if (!messages) {
        throw new HttpException(
          {
            message: `No hay mensajes por mostrar`,
            status: HttpStatus.INTERNAL_SERVER_ERROR,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return messages 
    } catch (error) {
      throw new HttpException(
        {
          message: `${error.message}`,
          status: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async findPendient(){
    try {
      const Pendient=await this.MessageModel.find({status:'Pendiente'})
      if (!Pendient) {
        throw new HttpException(
          {
            message: `No hay mensajes pendientes por mostrar`,
            status: HttpStatus.NOT_FOUND,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return Pendient 
    } catch (error) {
      throw new HttpException(
        {
          message: `${error.message}`,
          status: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  findOne(id: string) {
    return this.MessageModel.findOne({_id:id});
  }
  remove(id: string) {
    return this.MessageModel.findByIdAndDelete(id);
  }
}
