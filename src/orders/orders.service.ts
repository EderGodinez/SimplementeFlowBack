/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { shopping_car } from './../auth/entities/shoppingcar.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

//Modulos
import {Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Stripe from 'stripe';
import { Product } from 'src/products/entities/product.entity';
import { EmailService } from 'src/email/email.service';
import { OrderInfoResponse,Shipping } from './interfaces/orderinfo.response';
import { ProductUpdated } from './interfaces/StatusUpdated.response';
import { User } from 'src/auth/entities/user.entity';
import { Sales } from './classes/Sales.interface';
import { RegisterUser } from './classes/RegisterUser.interface';
//Clases


@Injectable()
export class OrdersService {
  private readonly stripe: Stripe;
  constructor(@InjectModel(Order.name)
              private OrdersModel: Model<Order>,
              @InjectModel(Product.name) 
              private ProductModel: Model<Product>,
              @InjectModel(User.name) 
              private UserModel: Model<User>,
              private EmailService:EmailService){
                this.stripe = new Stripe(process.env.STRIPE_API_KEY, {
                  apiVersion: '2023-08-16',
                });
              }
              
  async findAll():Promise<Order[]>{
    return this.OrdersModel.find().populate({path:'UserId',select:'names lastnames'}).exec();
    
  }
  findOne(id: string):Promise<Order> {
    return this.OrdersModel.findOne({numOrder:id});
  }
  remove(id: string) {
    return this.OrdersModel.findByIdAndDelete(id)
  }
  IncreaseId():Promise<number>{
    try {
      return this.OrdersModel.countDocuments().exec(); // Usar await para esperar la resolución de la promesa
    } catch (error) {
      throw 'something wrong is happen '+error; // Manejar cualquier error que pueda ocurrir durante la consulta
    }
  }
   async createCheckoutSession(CreateOrderDto:CreateOrderDto){
    const arrayIds=CreateOrderDto.Details.map((car)=>car.ProductId)
     const InfoProducts=await this.ProductModel.find({ _id: { $in: arrayIds } })
    const details:any=CreateOrderDto.Details.map((product,index)=>{
      return{
        productName:InfoProducts[index].ProductName,
        Size:product.size,
        Amount:product.quantity,
        Price:InfoProducts[index].price*((100-InfoProducts[index].Discount)/100)
      }
    })
    const customer = await this.stripe.customers.create({
      metadata: {
        userId: CreateOrderDto.UserId,
        cart: JSON.stringify(details),
      },
    });
    //Se crea el listado de los productos para el checkout sesion
    const line_items = InfoProducts.map((item,index) => {
      return {
        price_data: {
          currency: "mxn",
          product_data: {
            name: item.ProductName,
            metadata: {
              size: CreateOrderDto.Details[index].size, // Asume que `size` es la propiedad que contiene el numero de calzado
            },
          },
          unit_amount: Math.round(item.price*((100-item.Discount)/100) * 100),
        },
        quantity: CreateOrderDto.Details[index].quantity,
      };
    });
  //Se crea el checkout sesion
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "MX"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency: "mxn",
            },
            display_name: "Free shipping",
            //Las entrega se daran en un rago de entre 5 a 10 dias
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 5,
              },
              maximum: {
                unit: "business_day",
                value: 10,
              },
            },
          },
        },
      ],
      phone_number_collection: {
        enabled: true,
      },
      line_items,
      mode: "payment",
      customer: customer.id,
     //Url de redireccion en caso de que el pago sea aceptado con una respuesta de pago realizado
     success_url: `https://simplemente-flow.netlify.app/SimplementeFlow/Home`,
     //Url de redireccion en caso de que el pago sea rechazado 
     cancel_url: `https://simplemente-flow.netlify.app/SimplementeFlow/Checkout`
    });
    //Retorna URL en la cual el usuario ingresara sus datos bancarios
    return{ url: session.url };
   }
  //Crear una orden  en la base de ddatos
  async createOrder(customer, data):Promise<OrderInfoResponse>{
    const Items = JSON.parse(customer.metadata.cart);
    const arrayNames=Items.map((car)=>car.productName)
    const ProductsImages=await this.ProductModel.find({ ProductName: { $in: arrayNames } }).select('images description');
    const products = Items.map((item,index) => {
      return {
        productName:item.productName ,
        productDescription:ProductsImages[index].description,
        Image:ProductsImages[index].images[0],
        Amount: item.Amount,
        Price:item.Price,
        Size:item.Size
      };
    });
    const newOrder = new this.OrdersModel({
      numOrder:await this.IncreaseId()+1,
      UserId: customer.metadata.userId,
      Details:products,
      shipping: data.customer_details,
      TotalPay:data.amount_total/100,
      payment_status: data.payment_status,
      OrderDate:new Date(),

    });
    try {
      const savedOrder = await newOrder.save();///:DANGER
    const {_id,...rest}=savedOrder.toJSON()
    //  Clear Shopping car
    const clearCar=await this.UserModel.findOneAndUpdate({_id:rest.UserId}, {shopping_car:[]},{new:true})
    return {
      UserId:rest.UserId.toString(),
      numOrder:rest.numOrder,
      PayMethod:rest.PayMethod,
      Details:rest.Details,
      shipping:rest.shipping as Shipping,
      TotalPay:rest.TotalPay,
      OrderDate:rest.OrderDate
    }
    } catch (err) {
      console.error(err)
     throw err
    }
  }
  // Stripe webhoook encargado de validar el estado del checkout
  async handleWebhook(body: any) {
    let data;
    let eventType;
    let webhookSecret;
    //Si existe un webhook en linea 
    if (webhookSecret) {
      let event;
      const signature = body.headers["stripe-signature"];
      try {
        event = this.stripe.webhooks.constructEvent(
          body,
          signature,
          webhookSecret
          );
        } catch (err) {
          throw new Error('Webhook signature verification failed');
        }
        data = event.data.object;
        eventType = event.type;
      }
      else{
        data = body.data.object;
        eventType = body.type;
      }
      //Valida si el checkout tiene un estado de completado.
      if (eventType == "checkout.session.completed") {
        this.stripe.customers
        .retrieve(data.customer)
        .then(async (customer) => {
          try {
            // Crear la orden y guardadrla en una constante
           const orderinfo=await this.createOrder(customer, data);
            //Actualizar stock de los productos ordenados
            this.updateStock(customer)
            //Se envia la informacion a correo capturado al momento de realizar el pago.
            console.log(orderinfo)
            this.EmailService.sendOrderInfo(orderinfo)
            
          } catch (err) {
          console.error(err)
            throw new err;
          }
        })
        .catch((err) => console.error(err.message));
    }
}
updateStock(customer){
  const Items = JSON.parse(customer.metadata.cart);
  
    const products = Items.map((item) => {
      return {
        productName:item.productName ,
        productDescription:item.productDescription ,
        Image:item.Image,
        Amount: item.Amount,
        Price:item.Price,
        Size:item.Size
      };
    });
//Actualizacion de Stock de productos 
products.forEach(product => {
  this.ProductModel.updateOne(
      {ProductName:product.productName},
      {$inc: {[`sizes.${product.Size}`]: -product.Amount }},
      { new: true } // Devuelve el documento actualizado
    )
.catch((error) => {
  console.error('Error al actualizar el documento:', error);
});
  });  
}
async updateStatus(numOrder:number,delivery_status:string):Promise<ProductUpdated>{
  try{
    const exist=await this.OrdersModel.findOne({numOrder}).exec();
  if (exist) {
    this.OrdersModel.updateOne({numOrder},{delivery_status}).exec()
    return{
      HttpStatus:HttpStatus.OK,
      message:`El estado de la orden a cambiado a ${delivery_status}`,
      //Order:updated
    }
  }
  else{
    throw new HttpException(`Orden con numero${numOrder} no encontrado`,HttpStatus.NOT_FOUND)
  }
  }catch(error){
    throw  error
  }
  
}
MostSelledProducts(){
const currentMonth = new Date().getMonth() +1;//Cambiar a +1 para que sea el mes actual
return this.OrdersModel.aggregate([
  {
    $match: {
      OrderDate: {
        $gte: new Date(new Date().getFullYear(), currentMonth - 1, 1), // Primer día del mes actual  año-mes-dia
        $lt: new Date(new Date().getFullYear(), currentMonth, 1) // Primer día del siguiente mes     año/mes/dia
      }
    }
  },
  {
    $unwind: '$Details'
  },
  {
    $group: {
      _id:{
        ProductName:'$Details.productName',
        Size:'$Details.Size',
        Image:'$Details.Image'
      } ,
      totalSold: { $sum: '$Details.Amount' }
    }
  },
  {
    $sort: { totalSold: -1 }
  },
  {
    $limit: 6
  }
]).exec();
}
Earnings(){
  return this.OrdersModel.aggregate([
    {
      $match: {
        OrderDate: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
        },
      },
    },
    {
      $project: {
        _id: 0, // Excluye el campo _id del resultado final
        totalPay: "$TotalPay",
      },
    },
    {$group:{
      _id: null,
      TotalEarnings:{$sum:'$totalPay'}
    }},
    {
      $project: {
        _id: 0,
        TotalEarnings: 1,
      },
    },
  ]).exec()
}
async OrdersInfo(){
  const CurrentMonth=new Date().getMonth()+1
  const userRegister = await this.UserModel.aggregate([
    {
      $group: {
        _id: { $month: "$RegisterDate" },
        totalUsers: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        month: "$_id",
        totalUsers: 1,
      },
    },
    {
      $sort: { month: 1 },
    },
    {
      $group: {
        _id: null,
        userStats: { $push: { month: "$month", totalUsers: "$totalUsers" } },
      },
    },
    {
      $project: {
        _id: 0,
        userStats: {
          $map: {
            input: [...Array(CurrentMonth).keys()], // Crear un array de 0 a 11 representando los meses
            as: "m",
            in: {
              month: {
                $add: [1, "$$m"], // Sumar 1 a cada elemento del array para representar los meses de 1 a 12
              },
              totalUsers: {
                $ifNull: [
                  {
                    $filter: {
                      input: "$userStats",
                      as: "us",
                      cond: { $eq: ["$$us.month", { $add: [1, "$$m"] }] },
                    },
                  },
                  { $literal: [{ month: { $add: [1, "$$m"] }}] },
                ],
              },
            },
          },
        },
      },
    },
  ]);
  
  const Sales = await this.OrdersModel.aggregate([
    {
      $match: {
        OrderDate: {
          $gte: new Date(new Date().getFullYear(), 0, 1), // Primer día del año actual
          $lt: new Date(), // A Hoy
        },
      },
    },
    {
      $group: {
        _id: { $month: "$OrderDate" },
        totalSales: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        month: "$_id",
        totalSales: 1,
      },
    },
    {
      $sort: { month: 1 },
    },
    {
      $group: {
        _id: null,
        salesStats: { $push: { month: "$month", totalSales: "$totalSales" } },
      },
    },
    {
      $project: {
        _id: 0,
        salesStats: {
          $map: {
            input: [...Array(CurrentMonth).keys()], // Crear un array de 0 a 11 representando los meses
            as: "m",
            in: {
              month: {
                $add: [1, "$$m"], // Sumar 1 a cada elemento del array para representar los meses de 1 a 12
              },
              totalSales: {
                $ifNull: [
                  {
                    $filter: {
                      input: "$salesStats",
                      as: "ss",
                      cond: { $eq: ["$$ss.month", { $add: [1, "$$m"] }] },
                    },
                  },
                  { $literal: [{ month: { $add: [1, "$$m"] }, totalSales: 0 }] },
                ],
              },
            },
          },
        },
      },
    },
  ]);
  const combinedResults = [];

// Crear un mapa para almacenar los resultados por mes
const resultsMap = new Map();

// Función para combinar los resultados por mes
const combineResults = (result, key) => {
  if (!resultsMap.has(key)) {
    resultsMap.set(key, {});
  }

  const currentResult = resultsMap.get(key);
  Object.assign(currentResult, result);
};

// Combina los resultados de totalSales
Sales.forEach((result) => {
  const key = result.month;
  combineResults(result, key);
});

// Combina los resultados de totalUsers
userRegister.forEach((result) => {
  const key = result.month;
  combineResults(result, key);
});

// Convierte los resultados del mapa a un array
resultsMap.forEach((result, key) => {
  combinedResults.push({ month: parseInt(key), ...result });
});
  return combinedResults[0]
}
getByUserId(UserId:string){
return this.OrdersModel.find({UserId}).exec()
}
}


