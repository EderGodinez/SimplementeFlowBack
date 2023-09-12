import { Prop, Schema } from "@nestjs/mongoose/dist/decorators";


@Schema()
export class Address{
    @Prop()
    _id?:string;
    @Prop({default:""})
    Street:string;
    @Prop({default:""})
    number:string;
    @Prop({default:0,minlength:10})
    postal_Code:number;
    @Prop({default:""})
    Cologne:string;
    @Prop({default:""})
    State:string;
    @Prop({default:""})
    City:string;
}