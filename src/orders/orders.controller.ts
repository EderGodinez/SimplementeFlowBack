/* eslint-disable prettier/prettier */
import { CheckoutResponse } from './interfaces/Checkout.response';
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  //Creacion de una orden por medio de un checkout
  @Post('create-checkout')
  async createCheckoutSession(@Body() body:CreateOrderDto) {
    return this.ordersService.createCheckoutSession(body);
  }
//Webhook de stripe encargado de esperar la confirmacion del pago para crear el pedido y almacenarlo en la base de datos.
  @Post('webhook')
  async webhook(@Body() body: CheckoutResponse) {
    return this.ordersService.handleWebhook(body);
  }
  //Obtener todos los pedidos
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }
  @Get('info')
  OrdersInfo(){
    return this.ordersService.OrdersInfo()
  }
  @Get('mostSelled')
  findMostSelled(){
    return this.ordersService.MostSelledProducts()
  }
  @Get('earninigs')
  getEarn(){
    return this.ordersService.Earnings()
  }
//Obtener un pedido en especifico por medio de la ID
  @Patch(':numOrder')
  UpdateStatus(@Param('numOrder') numOrder: string,@Body() body:{status:string}){
    
    const {status}=body
    const numOrderInterger=parseInt(numOrder, 10)
  return this.ordersService.updateStatus(numOrderInterger,status)
  }
  @Get('User')
  FindByUserId(@Query('UserId') UserId:string){
    return this.ordersService.getByUserId(UserId)
  }
  @Get(':id')
  findOne(@Param('id') id: string){
    return this.ordersService.findOne(id);
  }
  //Eliminar una orden
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
