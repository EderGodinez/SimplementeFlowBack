import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,Request, Res, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UpdateUserDto,LoginDto,RegisterDto,userAddLike,userAddProduct} from './dto/index'
import { LoginResponse } from './interfaces/login-response';
import { User } from './entities/user.entity';
import { AuthGuard } from '../guards/auth/auth.guard';
import { Response } from 'express';
import { ChangePasswordDto } from './dto/changePassword.dto';


@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() LoginDto: LoginDto) {
   return this.authService.login(LoginDto)
  }
  @Post('/register')
  async register(@Body() RegisterDto: RegisterDto) {
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
  @Get('username/:id')
  GetUsername(@Param('id') id:string){
    return this.authService.getUsername(id)
  }
  @Get('total')
  TotalUsers(){
    return this.authService.GetTotalUsers()
  }
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
  return this.authService.findAll();
  }
  @UseGuards(AuthGuard)
  @Get('/check-token')
  checkToken(@Request() req:Request):LoginResponse{
      const user=req['user'] as User;
      return {
        User:user,
        token:this.authService.getJWT({id:user})
      }
  }
  
  @Get('/confirm/:token')
  async confirm(@Res() res: Response,@Param('token') token:string){
    const redirectUrl=await this.authService.confirmEmail(token);
    res.redirect(redirectUrl);
  }
  @UseGuards(AuthGuard)
  @Post('/AddProduct')
  addProductAtCard(@Body() AddCard:userAddProduct){
    return this.authService.addProductAtCar(AddCard)
  }
  @UseGuards(AuthGuard)
  @Post('/AddLikes')
  addLikes(@Body() userAddLike:userAddLike){
    return this.authService.addLikes(userAddLike)
  }
  @UseGuards(AuthGuard)
  @Patch('/ChangePass')
  changePassword(@Body() info:ChangePasswordDto){
    return this.authService.changePassword(info)
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() UpdateUserDto: UpdateUserDto) {
    return this.authService.update(id, UpdateUserDto);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
