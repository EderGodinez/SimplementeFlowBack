import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  findOne(id: number) {
    return this.ProductsModel.findById(id);
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
}
