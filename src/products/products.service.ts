import { HttpException, HttpStatus, Injectable, NotFoundException, Query } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './entities/product.entity';
import { Model } from 'mongoose';
import { CreateProductResponse } from './interfaces/CreateProduct.response';
import { ProductUpdatedResponse } from './interfaces/productUpdatedResponse.interface';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name)
    private ProductsModel: Model<Product>){}
    async create(CreateProductDto: CreateProductDto): Promise<CreateProductResponse> {
      const {_id,...Product}=CreateProductDto
      try{
        const newProduct=new this.ProductsModel(Product);
        const existingProduct = await this.ProductsModel.findOne({
          ProductName: CreateProductDto.ProductName,
        });
        //SE VALIDA SI ES QUE EXISTE EL PRODUCTO
        if (existingProduct) {
        throw new HttpException(
          {
            message: `Ya hay un producto con nombre ${CreateProductDto.ProductName}. Por favor, prueba con uno diferente.`,
            status: HttpStatus.BAD_REQUEST,
          },HttpStatus.BAD_REQUEST)
      }
     const New= await newProduct.save();
      return {
        product:New,
        message: `Producto ${CreateProductDto.ProductName} guardado exitosamente`,
        status: HttpStatus.OK,
      };
    }catch(error){
      throw new HttpException(
        {
          message: `${error.message}`,
          status: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
      
    }

  findAll() {
    
    return this.ProductsModel.find()
  }

  async findOne(id: string) {
    try {
      const product=await this.ProductsModel.findById(id);
      if(!product){
        throw new NotFoundException('Producto no existe')
      }
      return product
    } catch (error) {
      throw error
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto):Promise<ProductUpdatedResponse>{
    const exits=this.ProductsModel.findById(id)
    if (!exits) 
    throw new HttpException(
      {
        message: `Producto con id '${id}' no existe. Por favor, prueba con uno diferente.`,
        status: HttpStatus.BAD_REQUEST,
      },HttpStatus.BAD_REQUEST)
    try {
      const result = await this.ProductsModel.findByIdAndUpdate(id,updateProductDto);
      return { message: `Producto ${result.ProductName} ah sido actualizado exitosamente`, 
               product:result
              };
    } catch (error) {
      throw new HttpException(
        {
          message: `${error.message}`,
          status: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string):Promise<{message:string}> {
    const exits=this.ProductsModel.findById(id)
    if (!exits) 
    throw new HttpException(
      {
        message: `Producto con id '${id}' no existe. Por favor, prueba con uno diferente.`,
        status: HttpStatus.BAD_REQUEST,
      },HttpStatus.BAD_REQUEST)
    try {
      const result = await this.ProductsModel.findByIdAndDelete(id);
      return { message: `Producto ${result.ProductName} ah sido eliminado exitosamente` };
    } catch (error) {
      throw new HttpException(
        {
          message: `${error.message}`,
          status: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

  }
  findByCategory(category:string,limit?:number,skip?:number):Promise<Product[]>{
    return this.ProductsModel.find({'General.Category':[category,'Todos']}).skip(skip).limit(limit).exec();
  }
  GetNewestProducts(limit?:number,skip?:number):Promise<Product[]>{
    return this.ProductsModel.find().skip(skip).limit(limit).sort({RegisterDate:-1,inventoryStatus:1}).exec()
  }
  GetProductsOfferts(limit?:number,skip?:number):Promise<Product[]>{
    return this.ProductsModel.find({Discount:{$gt:0}}).skip(skip).limit(limit)
  }
  SearchProducts(query:string):Promise<Product[]>{
  return this.ProductsModel.find({
    $or: [
      { ProductName: { $regex: new RegExp(query, 'i') } },
      { Description: { $regex: new RegExp(query, 'i') } },
      {'General.patent':{$regex: new RegExp(query, 'i')}},
      {'General.model':{$regex: new RegExp(query, 'i')}},
      ]
  }).exec()
  }
  TotalProducts():Promise<number>{
    return this.ProductsModel.find().countDocuments()
  }
  GetProductSimilar(productsName:string,limit?:number):Promise<Product[]>{
    const productProperties:string[]=productsName.split(' ')
    console.log(productProperties[0])
    return this.ProductsModel.find({ ProductName: {
      $regex: `${productProperties[1]}`,
      $options:'i' ,
      $ne: productsName} }).limit(limit).exec()
  }
  async GetStock(){
    const totalStock=await this.ProductsModel.aggregate([
      // Convertir el objeto sizes en un array de documentos clave-valor
      {
        $project: {
          sizesArray: {
            $objectToArray: "$sizes",
          },
        },
      },
      // Descomponer el array de documentos clave-valor
      { $unwind: "$sizesArray" },
      // Agrupar por la clave y sumar los valores
      {
        $group: {
          _id: "$sizesArray.k",
          total: { $sum: "$sizesArray.v" },
        },
      },
      {
        $group:{
          _id:null,
          TotalStock:{$sum:"$total"}
        }
      }
      // Proyectar solo los resultados finales
      ,{
        $project: {
          _id: 0, // Excluir el campo _id del resultado final si no es necesario
          TotalStock: 1,
        },
      },
      
    ]);
    return totalStock[0]
    }
}
