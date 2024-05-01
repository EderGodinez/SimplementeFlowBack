/* eslint-disable prettier/prettier */
import { CheckoutResponse } from './interfaces/Checkout.response';
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { AdminGuard } from 'src/guards/admin/admin.guard';
@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  //Creacion de una orden por medio de un checkout
  @ApiOperation({
    description:'Permite un pedido pagado con stripe',
    summary:'Crear un pedido'
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('create-checkout')
  async createCheckoutSession(@Body() body:CreateOrderDto) {
    return this.ordersService.createCheckoutSession(body);
  }
  @ApiOperation({
    description:'Es el encargado de esperar la confirmacion del pago para crear el pedido y almacenarlo en la base de datos.',
    summary:'Webhook de stripe'
  })
//Webhook de stripe encargado de esperar la confirmacion del pago para crear el pedido y almacenarlo en la base de datos.
  @Post('webhook')
  async webhook(@Body() body: CheckoutResponse) {
    return this.ordersService.handleWebhook(body);
  }
  @ApiOperation({
    description:'Permite obtener listado de pedidos',
    summary:'Obtener todos los pedidos'
  })
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  //Obtener todos los pedidos
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }
  @ApiOperation({
    description:'La informacion esta clasificada por mes',
    summary:'Permite obtener todos los datos de las ventas y usuarios '
  })
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Get('info')
  OrdersInfo(){
    return this.ordersService.OrdersInfo()
  }
  @ApiOperation({
    summary:'Obtener los productos mas vendidos'
  })
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Get('mostSelled')
  findMostSelled(){
    return this.ordersService.MostSelledProducts()
  }
  @ApiOperation({
    summary:'Obtener las ganancias totales del mes actual'
  })
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Get('earninigs')
  getEarn(){
    return this.ordersService.Earnings()
  }
  @ApiOperation({
    description:'Puede ser estado completado-cancelado-pendiente',
    summary:'Actualizar estado de un pedido'
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':numOrder')
  UpdateStatus(@Param('numOrder') numOrder: string,@Body() body:{status:string}){
    
    const {status}=body
    const numOrderInterger=parseInt(numOrder, 10)
  return this.ordersService.updateStatus(numOrderInterger,status)
  }
  @ApiOperation({
    summary:'Obtener ordenes de usuario especifico'
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('User')
  FindByUserId(@Query('UserId') UserId:string){
    return this.ordersService.getByUserId(UserId)
  }
  @ApiOperation({
    description:'Los datos de un pedido, hasta los datos del cliente',
    summary:'Permite los detalles de un pedido con su ID'
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string){
    return this.ordersService.findOne(id);
  }
  @ApiOperation({
    description:'Desde los productos hasta los datos del cliente',
    summary:'Permite obtener todos los detalles de un pedido'
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  //Eliminar una orden
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
