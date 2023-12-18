import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Message {
    @Prop({required:true,minlength:15})
    UserEmail:string;
    @Prop({required:true,minlength:5})
    username:string;
    @Prop({required:true,default:'Pendiente'})//No en dto
    status:string
    @Prop({required:true,minlength:10})
    issue:string
    @Prop({required:true,minlength:30})
    Content:string
    @Prop({required:true,default:new Date()})//No en dto
    MessageDate:Date
}
export const MessageSchema = SchemaFactory.createForClass(Message);
  