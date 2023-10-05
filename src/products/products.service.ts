import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './entities/product.entity';
import { Model } from 'mongoose';
import { CreateProductResponse } from './interfaces/CreateProduct.response';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name)
    private ProductsModel: Model<Product>){}
    async create(CreateProductDto: CreateProductDto): Promise<CreateProductResponse> {
    try{
      const newProduct=new this.ProductsModel(CreateProductDto);
      const existingProduct = await this.ProductsModel.findOne({
        ProductName: CreateProductDto.ProductName,
      });
      //SE VALIDA SI ES QUE EXISTE EL PRODUCTO
      if (existingProduct) {
        return{
          message:`Product ${CreateProductDto.ProductName} already existing in database with this name`,
          status:400
        }
      }
      await newProduct.save();
      return{
        message:`product ${CreateProductDto.ProductName} saved successfully`,
        status:200
      }
    }catch(error){
      throw new Error('Product could not be created'+error);
    }
      
    }

  findAll() {
    return this.ProductsModel.find()
  }

  findOne(id: number) {
    return this.ProductsModel.findById(id);
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.ProductsModel.findByIdAndUpdate(id,updateProductDto)
  }

  remove(id: number) {
    return this.ProductsModel.findByIdAndDelete(id);
  }
}
