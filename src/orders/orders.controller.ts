import { CheckoutResponse } from './interfaces/Checkout.response';
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

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
//Obtener un pedido en especifico por medio de la ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }
  //Eliminar una orden
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}