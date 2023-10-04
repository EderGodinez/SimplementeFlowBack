import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import {CreateUserDto,UpdateUserDto,LoginDto,RegisterDto} from './dto/index'
import { LoginResponse } from './interfaces/login-response';
import { User } from './entities/user.entity';
import { AuthGuard } from './guards/auth/auth.guard';
import { Response } from 'express';

@Controller('auth')
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
        // Registration failed (email or phone already exists)
        return { message: 'Error: Email or phone already exists!', status: 400 };
      } else {
        // Registration succeeded
        return { message: 'Email sent successfully :D', status: 200 };
      }
    } catch (error ) {
      // Handle any other errors that may occur during registration
      return { message: `An error occurred during registration ${error}`, status: 500 };
    }
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
  confirm(@Res() res: Response,@Param('token') token:string){
    this.authService.confirmEmail(token);
    const redirectUrl = 'http://localhost:4200/SimplementeFlow/NewUser/Success'; // Replace with your desired URL
    res.redirect(redirectUrl);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() UpdateUserDto: UpdateUserDto) {
    return this.authService.update(+id, UpdateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
