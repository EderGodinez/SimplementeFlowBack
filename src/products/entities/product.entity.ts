import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@           Schema()
            export class GeneralInf{
            @Prop({default:'Nike'})
            patent:string;
            @Prop({default:'Jordan 1'})
            model:string;
            @Prop({default:'Unisex'})
            Gender:Gender;
            @Prop({default:'EveryOne'})
            age:Public;
            @Prop({default:'Narrow'})
            width_type:Width_type;
            @Prop({default:'Laces'})
            fit_type:'Laces'|'Velcro'
            @Prop({default:'Original'})
            class_shoes:Shoes;
            @Prop({default:'leather'})
            E_Material:'leather'|'fabric';
            @Prop({default:'mesh'})
            I_Material:'mesh'|'cotton'
            @Prop({default:'rubber'})
            Shoe_sole:string;        
             }
            @Schema()
            export class Coments{
        @Prop({min:1,max:5})
        rate:number;
        @Prop({type:Date})
        Post_date:Date;
        @Prop({required:true,type:String})
        Title:string;
        @Prop({required:true,type:String})
        description:string;
            }
    
            @Schema()
            export class Sizes{
                @Prop({required:true,unique:true,min:20,max:30})
                size:number;
                @Prop({required:true,type:Number})
                stock:number;
            }
            
            export  enum Shoes{
                    Original="Original",
                    Exclusive="Exclusive",
                    G5="G5",
                    UA="UA",
                    Top="Top Quality"
            }
                
            export enum Width_type{  
                        Narrow="Narrow",
                        Standard="Standard",
                        wide="wide",
                        extra_wide="extra_wide"
             } 
                    
            export enum Gender{
                            Male='Male',
                            Female='Female',
                            Unisex='Unisex'
            }
            export enum Public{
                                Children="Children",
                                Adults="Adults",
                                EveryOne="EveryOne"
             }
@Schema()
export class Product {
    id_?:string;
    @Prop({required:true,unique:true})
    modelName:string;
    @Prop({required:true,minlength:20})
    description:string;
    @Prop({required:true,minlength:4})
    price:number;
    @Prop({minlength:1,default:{}})
    sizes:Sizes[];
    @Prop({required:true,minlength:1})
    images:string[];
    @Prop({required:false,default:{}})
    General?:GeneralInf;
    @Prop({required:true,minlength:1})
    adventages:string[];
    @Prop({required:true,minlength:1})
    disadventages:string[];
    coments?:Coments[];
}

    export const ProductSchema = SchemaFactory.createForClass(Product);