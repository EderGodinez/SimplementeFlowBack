import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import {CreateUserDto,UpdateUserDto,LoginDto,RegisterDto} from './dto/index'
//import { AuthGuard } from './guards/auth/auth.guard';
import { LoginResponse } from './interfaces/login-response';
import { User } from './entities/user.entity';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }
  // @Post('/login')
  // login(@Body() LoginDto: LoginDto) {
  //  return this.authService.login(LoginDto)
  // }
  // @Post('/register')
  // register(@Body() RegisterDto: RegisterDto) {
  //  return this.authService.register(RegisterDto)
  // }
  //@UseGuards(AuthGuard)
  @Get()
  findAll() {
  //  
  return this.authService.findAll();
  }
  //@UseGuards(AuthGuard)
  // @Get('check-token')
  // checkToken(@Request() req:Request):LoginResponse{
  //     const user=req['user'] as User;
  //     return {
  //       User:user,
  //       token:this.authService.getJWT({id:user._id})
  //     }
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() UpdateUserDto: UpdateUserDto) {
  //   return this.authService.update(+id, UpdateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
//}
