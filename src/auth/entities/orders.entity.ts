import { Prop, Schema } from "@nestjs/mongoose/dist/decorators";

@Schema()
export class Orders{
@Prop({type:[String],default:['']})
    product_id:string[];
@Prop({type:[Number],default:[0]})
amount:number[];
}

