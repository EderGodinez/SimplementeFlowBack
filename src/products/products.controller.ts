import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductResponse } from './interfaces/CreateProduct.response';
import { ProductUpdatedResponse } from './interfaces/productUpdatedResponse.interface';
import { Product } from './entities/product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) :Promise<CreateProductResponse>{
    return this.productsService.create(createProductDto);
  }
  @Get('total')
  TotalProducts():Promise<number>{
    return this.productsService.TotalProducts()
  }

  @Get()
  findAll(@Query('Category') category:string,@Query('limit') limit:string,@Query('skip') skip:string):Promise<Product[]> {
    const limitNumber = limit ? parseInt(limit, 10) : undefined;
    const skipNumber = skip ? parseInt(skip, 10) : undefined;
    //En caso de que unicfamente se quieran consultar todos los productos
    if (!category) {
      return this.productsService.findAll();
    }
    //En caso de que si haya un filtro de por medio
    return this.productsService.findByCategory(category,limitNumber,skipNumber)
  }
  @Get('newest')
  findRecient(@Query('limit') limit:string,@Query('skip') skip:string):Promise<Product[]>{
    const limitNumber = limit ? parseInt(limit, 10) : undefined;
    const skipNumber = skip ? parseInt(skip, 10) : undefined;
    return this.productsService.GetNewestProducts(limitNumber,skipNumber)
  }
  @Get('offers')
  findOffers(@Query('limit') limit:string,@Query('skip') skip:string):Promise<Product[]>{
    const limitNumber = limit ? parseInt(limit, 10) : undefined;
    const skipNumber = skip ? parseInt(skip, 10) : undefined;
    return this.productsService.GetProductsOfferts(limitNumber,skipNumber)
  }
  @Get('search')
  SearchProducts(@Query('query') query:string):Promise<Product[]>{
    console.log(query)
    return this.productsService.SearchProducts(query)
  }
  @Get('similar')
  GetSimilarProducts(@Query('limit') limit:string,@Query('ProductName') productname:string){
    console.log(productname,limit)
    const limitNumber = limit ? parseInt(limit, 10) : undefined;
    return this.productsService.GetProductSimilar(productname,limitNumber)
  }
  @Get(':id')
  findOne(@Param('id') id: string):Promise<Product> {
    return this.productsService.findOne(+id);
  }
  

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto):Promise<ProductUpdatedResponse> {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

}
