import { Prop, Schema } from "@nestjs/mongoose/dist/decorators";

interface ShoppingCar{
  ProductId:string,
  size?:number,
  quantity:number
}
@Schema()
export class shopping_car implements ShoppingCar{
    @Prop()
    ProductId:string;
    @Prop({default:0})
    size:number;
    @Prop({default:1})
    quantity:number;
    
}