import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, ObjectId} from "mongoose";

@Schema()
export class Order {
    @Prop({required:true,unique:true})
    numOrder:number;
    @Prop({ type: SchemaTypes.ObjectId,ref:'User',required:true}) // Establece la referencia a la colección User
    UserId: ObjectId;
    @Prop({default:defaultOrderDate})
    OrderDate?: Date;
    @Prop({required:true,default:"Tarjeta"})
    PayMethod?: string;
    @Prop({minlength:1,required:true})
    Details: OrderProduct[];
    @Prop({type:Object})
    shipping:Object;
    @Prop({type:Number})
    TotalPay: number;
    @Prop({ type: String,default:"Pendiente"})
    delivery_status: 'Cancelado' | 'Pendiente'|"Entregado"
}
@Schema()
export class OrderProduct {
    @Prop({required:true,minlength:20})
    productName:string;
    @Prop({required:true,minlength:20})
    productDescription:string;
    @Prop({required:true})
    Image:string;
    @Prop({required:true,min:1})
    Amount:number;
    @Prop({required:true})
    Price:number; 
}
function defaultOrderDate() {
    let fechaActual = new Date();
    // Ajusta la fecha y hora a la zona horaria UTC-6 (México)
    fechaActual.setUTCHours(fechaActual.getUTCHours() - 6);
    return fechaActual;
  }

export const OrderSchema = SchemaFactory.createForClass(Order);
