import {Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/entities/user.entity';
@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name)
              private OrdersModel: Model<Order>,
              @InjectModel(User.name) 
              private UserModel: Model<User>){}
              
  async create(createOrderDto: CreateOrderDto) {
    const newOrder=new this.OrdersModel(createOrderDto);
    // Realizar la agregación para buscar si el usuario ingresado existe
    const searchUser = await this.UserModel.aggregate([
      {
          $match: { _id: newOrder.UserId } ,// Puedes ajustar esto según tu lógica
      },
      {
        $project:{ _id: 1}
      }
  ]).exec();
  //VALIDA SI EL USUARIO EXISTE DENTRO DE NUESTRA COLECCION DE USUARIOS
    if(searchUser.length==0){
      return {message:'UserID not exist try to type a correct one'}
    }
    
    newOrder.id=await this.IncreaseId()+1;
    newOrder.Details.forEach(element => {
      element.Total=element.Amount*element.Price;
    });    
    let TotalPay=0;
    newOrder.Details.forEach(element => {
      TotalPay+=element.Total;
    });
    newOrder.TotalPay=TotalPay;
    await newOrder.save();
         
         return newOrder;
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
  IncreaseId():Promise<number>{
    try {
      return this.OrdersModel.countDocuments().exec(); // Usar await para esperar la resolución de la promesa
    } catch (error) {
      throw 'something wrong happen '+error; // Manejar cualquier error que pueda ocurrir durante la consulta
    }
        }
  }

