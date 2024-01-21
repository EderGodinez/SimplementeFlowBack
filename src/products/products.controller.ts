import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductResponse } from './interfaces/CreateProduct.response';
import { ProductUpdatedResponse } from './interfaces/productUpdatedResponse.interface';
import { Product } from './entities/product.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/guards/admin/admin.guard';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @ApiOperation({
    description:'Permite crear un producto con todas sus caracteristicas como entrada',
    summary:'Crear un producto'
  })
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Post()
  create(@Body() createProductDto: CreateProductDto) :Promise<CreateProductResponse>{
    return this.productsService.create(createProductDto);
  }
  @ApiOperation({
    description:'Permite crear un producto con todas sus caracteristicas como entrada',
    summary:'Permite obtener todos los productos en existencia'
  })
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Get('total')
  TotalProducts():Promise<number>{
    return this.productsService.TotalProducts()
  }
  @ApiOperation({
    summary:'Obterner el stock disponible'
  })
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
@Get('Stock')
GetStock(){
  return this.productsService.GetStock()
}
@ApiOperation({
  description:'Permite obtener listado de productos',
  summary:'Obtener info de productos'
})
  @Get()
  findAll(@Query('Category') category:string,@Query('limit') limit:string,@Query('skip') skip:string):Promise<Product[]> {
    const limitNumber = limit ? parseInt(limit, 10) : undefined;
    const skipNumber = skip ? parseInt(skip, 10) : undefined;
    //En caso de que unicfamente se quieran consultar todos los productos
    if (!category) {
      return this.productsService.findAll();
    }
    switch(category){
      case 'Ofertas':
        return this.findOffers("","")
        case 'Nuevos productos':
        return this.findRecient("20","")
        case "Niños":
        case "Mujeres":
        case "Hombres":
          return this.productsService.findByCategory(category,limitNumber,skipNumber)
      default:
        return this.SearchProducts(category)
    }
    //En caso de que si haya un filtro de por medio
  }
  @ApiOperation({
    description:'Permite obtener un listado de los productos mas nuevos',
    summary:'Regresa los productos mas recientes'
  })
  @Get('newest')
  findRecient(@Query('limit') limit:string,@Query('skip') skip:string):Promise<Product[]>{
    const limitNumber = limit ? parseInt(limit, 10) : undefined;
    const skipNumber = skip ? parseInt(skip, 10) : undefined;
    return this.productsService.GetNewestProducts(limitNumber,skipNumber)
  }
  @ApiOperation({
    summary:'Obtener los productos en oferta'
  })
  @Get('offers')
  findOffers(@Query('limit') limit:string,@Query('skip') skip:string):Promise<Product[]>{
    const limitNumber = limit ? parseInt(limit, 10) : undefined;
    const skipNumber = skip ? parseInt(skip, 10) : undefined;
    return this.productsService.GetProductsOfferts(limitNumber,skipNumber)
  }
  @ApiOperation({
    description:'Permite buscar un producto deacuerdo a descripcion,marca,modelo o nombre del producto',
    summary:'Busqueda de un producto'
  })
  @Get('search')
  SearchProducts(@Query('query') query:string):Promise<Product[]>{
    return this.productsService.SearchProducts(query)
  }
  @ApiOperation({
    description:'Permite obtener un listado de productos relacionado con una misma marca',
    summary:'Listado de productos similares'
  })
  @Get('similar')
  GetSimilarProducts(@Query('ProductName') productname:string,@Query('limit') limit:string){
    const limitNumber = limit ? parseInt(limit, 10) : undefined;
    return this.productsService.GetProductSimilar(productname,limitNumber)
  }
  @ApiOperation({
    description:'Permite obtener toda la informacion de un producto',
    summary:'Obtener un producto'
  })
  @Get(':id')
  findOne(@Param('id') id: string):Promise<Product> {
    return this.productsService.findOne(id);
  }
  
  @ApiOperation({
    summary:'Actualizar informacion de producto',
  })
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto):Promise<ProductUpdatedResponse> {
    return this.productsService.update(id, updateProductDto);
  }
  @ApiOperation({
    summary:'Elimminar un producto'
  })
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

}
