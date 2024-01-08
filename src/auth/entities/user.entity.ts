import { Prop, SchemaFactory,Schema } from "@nestjs/mongoose";
import { Address } from "./address.entity";
import { shopping_car } from "./shoppingcar.entity";

@Schema()
export class User{
    _id?:string;
    @Prop({unique:true,required:true})
    email?:string;
    @Prop({required:true})
    names:string;
    @Prop({required:true})
    lastnames:string;
    @Prop({type:Date,required:true})
    birthdate:Date;
    @Prop({required:true})
    gender:string;
    @Prop({unique:true,required:true,minlength:10})
    phone:number;
    @Prop({minlength:10,required:true})
    password?:string;
    @Prop({default:true})
    isActive:boolean;
    @Prop({default:'User'})
    UserRole:string;
    @Prop({type:[String],default:[]})
    likes:string[];
    @Prop({default:[]})
    shopping_car:shopping_car[];
    @Prop({default:{}})
    data_Address:Address
    @Prop({type:Date,default:new Date()})
    RegisterDate:Date
}
export const UserSchema = SchemaFactory.createForClass(User);