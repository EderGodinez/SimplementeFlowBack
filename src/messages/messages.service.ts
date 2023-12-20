import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './entities/message.entity';
import { Model } from 'mongoose';
import { TotalMessages } from './interfaces/TotalMessages.response';

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
  async CountMessagesByStatus(status:string):Promise<TotalMessages>{
    try {
      const Messages=await this.MessageModel.find({status}).count()
      if (Messages===0) {
        return{
          totalMessages: '0',
          status: HttpStatus.NOT_FOUND,
        }
      }
      return {
        totalMessages:Messages.toString(),
        status:HttpStatus.OK
      }
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
   updateMessage(id:string,Message:Message){
    return this.MessageModel.findByIdAndUpdate(id,Message)
  }
  remove(id: string) {
    return this.MessageModel.findByIdAndDelete(id);
  }
}
