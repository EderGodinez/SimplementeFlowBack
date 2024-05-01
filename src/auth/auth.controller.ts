/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,Request, Res, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UpdateUserDto,LoginDto,RegisterUserDto,userAddLike,userAddProduct} from './dto/index'

import { LoginResponse } from './interfaces/login-response';
import { User } from './entities/user.entity';
import { AuthGuard } from '../guards/auth/auth.guard';
import { Response } from 'express';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AdminGuard } from 'src/guards/admin/admin.guard';

@ApiTags('Users')
@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiOperation({
    description:'Permite iniciar sesion y de ser exitosa manda un token de acceso',
    summary:'Login para usuario'
  })
  @Post('/login')
  login(@Body() LoginDto: LoginDto) {
   return this.authService.login(LoginDto)
  }
  @ApiOperation({
    description:'Permite crear una cuenta de ser aceptados se envia correo de confirmacion',
    summary:'Registro de nuevo usuario'
  })
  @Post('/register')
  async register(@Body() RegisterDto: RegisterUserDto) {
    try {
      const data = await this.authService.register(RegisterDto);   
      if (data==null) {
        throw new HttpException( 'Correo o numero de telefono asignado a una cuenta',HttpStatus.NOT_ACCEPTABLE) 
      } else {
        // Registration succeeded
        return { message: 'Correo enviado exitosamente', status: 200 };
      }
    } catch (error ) {
      throw error
    }
  }
  @ApiOperation({
    description:'Retorna nombre completo de usuario de acuerdo a id',
    summary:'Permite obtener el nombre de un usuario'
  })
  @Get('username/:id')
  GetUsername(@Param('id') id:string){
    return this.authService.getUsername(id)
  }
  @ApiOperation({
    description:'Regresa el total de usuarios registrados',
    summary:'Obtener el total de usuarios registrados'
  })
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Get('total')
  TotalUsers(){
    return this.authService.GetTotalUsers()
  }
  
  @ApiOperation({
    description:'Regresa un listado de los usuarios',
    summary:'Obtener toda la informacion de todos los usuarios'
  })
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Get()
  findAll() {
  return this.authService.findAll();
  }
  @ApiOperation({
    description:'Valida si un token es valido aun',
    summary:'Valida si un token aun es valido'
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/check-token')
  checkToken(@Request() req:Request):LoginResponse{
      const user=req['user'] as User;
      return {
        User:user,
        token:this.authService.getJWT({id:user})
      }
  }
  @ApiOperation({
    description:'Deacuerdo a el correo que se envia este endpoint sera el encargado de confrimar el registro y guardarlo en la base de datos',
    summary:'Confirma el registro de su cuenta'
  })
  @Get('/confirm/:token')
  async confirm(@Res() res: Response,@Param('token') token:string){
    const redirectUrl=await this.authService.confirmEmail(token);
    res.redirect(redirectUrl);
  }
  @ApiOperation({
    description:'Permite agregar un producto a carrito de compras',
    summary:'Permite al usuario agregar un producto a carrito'
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('/AddProduct')
  addProductAtCard(@Body() AddCard:userAddProduct){
    return this.authService.addProductAtCar(AddCard)
  }
  @ApiOperation({
    description:'Permite agregar a un usuario un producto a su lista de favoritos',
    summary:'Agregar un producto a favoritos'
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('/AddLikes')
  addLikes(@Body() userAddLike:userAddLike){
    return this.authService.addLikes(userAddLike)
  }
  @ApiOperation({
    description:'Permite al usuario cambiar la contraseña',
    summary:'Cambio de contraseña'
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch('/ChangePass')
  changePassword(@Body() info:ChangePasswordDto){
    return this.authService.changePassword(info)
  }
  @ApiOperation({
    description:'Permite retornar la informacion del usuario mediante el id',
    summary:'Encontrar un usuario por id'
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }
  @ApiOperation({
    description:'Permite actualizacion de la informacion de un usuario',
    summary:'Actualizar informacion'
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() UpdateUserDto: UpdateUserDto) {
    return this.authService.update(id, UpdateUserDto);
  }
  @ApiOperation({
    description:'Permite eliminar usuario mediante un id',
    summary:'Elimminar usuario'
  })
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
