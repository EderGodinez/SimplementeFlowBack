import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, ObjectId} from "mongoose";
import { User } from "src/auth/entities/user.entity";

export enum OrderStatus{
    payed,
    cancel, 
    pendient, 
    complete
}
@Schema()
export class Order {
    @Prop({unique:true})
    id:number;
    @Prop({ type: SchemaTypes.ObjectId, ref: User.name ,required:true}) // Establece la referencia a la colección User
    UserId: ObjectId;
    @Prop({default:defaultOrderDate})
    OrderDate?: Date;
    @Prop({required:true})
    PayMethod: string;
    @Prop({minlength:1,required:true})
    Details: OrderProduct[];
    @Prop({})
    TotalPay: number;
    @Prop({ type: String, enum: OrderStatus,default:'pendient'})
    status: 'payed' | 'cancel' | 'pendient' | 'complete';
}
@Schema()
export class OrderProduct {
    @Prop({required:true,minlength:20})
    productName:string;
    @Prop({required:true})
    Image:string;
    @Prop({required:true,min:1})
    Amount:number;
    @Prop({required:true})
    Price:number;
    @Prop({})
    Total:number;   
}
function defaultOrderDate() {
    let fechaActual = new Date();
    // Ajusta la fecha y hora a la zona horaria UTC-6 (México)
    fechaActual.setUTCHours(fechaActual.getUTCHours() - 6);
    return fechaActual;
  }

export const OrderSchema = SchemaFactory.createForClass(Order);
