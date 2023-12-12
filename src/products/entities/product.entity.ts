import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


            // @Schema()
            export class GeneralInf{
            @Prop({default:'Nike'})
            patent:string;
            @Prop({default:'Jordan 1'})
            model:string;
            @Prop({default:'Todos'})
            Category:Categories;
            @Prop({default:'Todos'})
            age:Public;
            @Prop({default:'Angosto'})
            width_type:Width_type;
            @Prop({default:'Cordones'})
            fit_type:'Cordones'|'Velcro'
            @Prop({default:'Original'})
            class_shoes:Shoes;
            @Prop({default:'Cuero'})
            E_Material:'Cuero'|'Tela'|'Gamuza';
            @Prop({default:'Algodon'})
            I_Material:'Malla'|'Algodon'
            @Prop({default:'Goma'})
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
            export  enum Shoes{
                    Original="Original",
                    Exclusive="Exclusivo",
                    G5="G5",
                    UA="UA",
                    Top="Top Quality"
            }
                
            export enum Width_type{  
                        Angosto="Angosto",
                        Estandar="Estandar",
                        ancho="ancho",
                        extra_ancho="extra ancho"
             } 
            export enum Categories{
                            Hombre='Hombres',
                            Mujer='Mujeres',
                            Nino='Niños',
                            Todos='Todos'
            }
            export enum Public{
                                Children="Niños",
                                Adultos="Adultos",
                                Todos="Todos"
             }
@Schema()
export class Product {
    @Prop({required:true,unique:true})
    ProductName:string;
    @Prop({required:true,minlength:20})
    description:string;
    @Prop({required:true,min:0,max:100})
    Discount:number;
    @Prop({required:true,default:'Disponible'})
    inventoryStatus:string
    @Prop({required:true,minlength:3})
    price:number;
    @Prop({default: {},type:Object})
    sizes: Record<string,number>;
    @Prop({required:true,minlength:1})
    images:string[];
    @Prop({required:false,default:{}})
    General:GeneralInf;
    @Prop({required:true,minlength:1})
    adventages:string[];
    @Prop({required:true,minlength:1})
    disadventages:string[];
    @Prop({default:new Date()})
    RegisterDate:Date
    coments?:Coments[];
}

    export const ProductSchema = SchemaFactory.createForClass(Product);