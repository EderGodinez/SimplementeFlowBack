//Modulos
import {Injectable } from '@nestjs/common';
import { CreateOrderDto, OrderProduct } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/entities/user.entity';
import Stripe from 'stripe';
import { Console } from 'console';
import { Product } from 'src/products/entities/product.entity';
//Clases
const stripe = new Stripe(process.env.STRIPE_API_KEY, {
  apiVersion: '2023-08-16',
});

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name)
              private OrdersModel: Model<Order>,
              @InjectModel(Product.name) 
              private ProductModel: Model<Product>){}
  
  
  findAll():Promise<Order[]>{
    return this.OrdersModel.find();
  }
  findOne(id: string):Promise<Order> {
    return this.OrdersModel.findById(id);
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
    const customer = await stripe.customers.create({
      metadata: {
        userId: CreateOrderDto.UserId,
        cart: JSON.stringify(CreateOrderDto.Details),
      },
    });
    const line_items = CreateOrderDto.Details.map((item) => {
      return {
        price_data: {
          currency: "mxn",
          product_data: {
            name: item.productName,
            images: [item.Image],
            description: item.productDescription,
            metadata: {
              size: item.Size, // Asume que `size` es la propiedad que contiene el tamaño
            },
          },
          unit_amount: item.Price * 100,
        },
        quantity: item.Amount,
      };
    });
  
    const session = await stripe.checkout.sessions.create({
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
            // Delivers between 5-7 business days
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 5,
              },
              maximum: {
                unit: "business_day",
                value: 7,
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
     success_url: `http://localhost:4200/SimplementeFlow/Checkout/OrderSuccess`,
     //Url de redireccion en caso de que el pago sea rechazado 
     cancel_url: `http://localhost:4200/SimplementeFlow/Checkout`
    });
    
  
    // res.redirect(303, session.url);
    return{ url: session.url };
   }
  
  // Create order function
  
  async createOrder(customer, data){
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
    const newOrder = new this.OrdersModel({
      numOrder:await this.IncreaseId()+1,
      UserId: customer.metadata.userId,
      Details:products,
      shipping: data.customer_details,
      TotalPay:data.amount_total/100,
      payment_status: data.payment_status,
    });
    
    try {
      const savedOrder = await newOrder.save();
    } catch (err) {
      console.log(err);
    }
    
  }
  
  // Stripe webhoook
  
  async handleWebhook(body: any) {
    let data;
    let eventType;

    // Check if webhook signing is configured.
    let webhookSecret;
    // webhookSecret = process.env.STRIPE_WEB_HOOK;

    if (webhookSecret) {
      // Retrieve the event by verifying the signature using the raw body and secret.
      let event;
      let signature = body.headers["stripe-signature"];
      try {
        event = stripe.webhooks.constructEvent(
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
    if (eventType == "checkout.session.completed") {
      stripe.customers
        .retrieve(data.customer)
        .then(async (customer) => {
          try {
            // CREATE ORDER
            this.createOrder(customer, data);
            //Actualizar stock de los productos ordenados
            this.updateStock(customer)

          } catch (err) {
            console.log(typeof this.createOrder);
            console.log(err);
          }
        })
        .catch((err) => console.log(err.message));
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
}


