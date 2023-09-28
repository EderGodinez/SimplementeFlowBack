import {CreateUserDto,UpdateUserDto,LoginDto,RegisterDto} from './dto/index'
import { BadRequestException, Injectable ,InternalServerErrorException, UnauthorizedException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcryptjs from 'bcryptjs'
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response';


@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) 
              private UserModel: Model<User>,
              private JwtService:JwtService) {}
   

  async create(createUserDto: CreateUserDto): Promise<User> {
    
    try {
      
      const { password, ...userData } = createUserDto;
           
      const newUser = new this.UserModel({
        password: bcryptjs.hashSync( password, 10 ),
        ...userData
      });
       await newUser.save();
       const { password:_, ...user } = newUser.toJSON();
       
       return user;
      
    } catch (error) {
      console.log(error)
      if( error.code === 11000 ) {
        const {keyPattern}=error;
        const e=Object.keys(keyPattern)[0]
        throw new BadRequestException(`${createUserDto[e]} already exists!`)
      }
      throw new InternalServerErrorException('Something terribe happen!!!');
    }
  }

   async register(RegisterDto:RegisterDto):Promise<LoginResponse>{
    const user=await this.create(RegisterDto);
    return{
      User:user,
      token:this.getJWT({ id:user._id }),
    }
   }


  async login(LoginDto:LoginDto):Promise<LoginResponse>{
    const {email,password}=LoginDto;
    const user =await this.UserModel.findOne({email});
    if (!user) {
      throw new UnauthorizedException('Not valid credencials -email')
    }
    if (!bcryptjs.compareSync(password,user.password)) {
      throw new UnauthorizedException('Not valid credencials -password')
    }
    const {password:_,...rest}=user.toJSON()
  
    return{
      User:rest,
      token:this.getJWT({ id:user.id }),
    }
}

async findUserById(UserId:string){
    const user=await this.UserModel.findById(UserId)
    const{password,...rest}=user.toJSON();
    return rest;
}




  findAll():Promise<User[]>{
    return this.UserModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, UpdateUserDto: UpdateUserDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
  getJWT(payload:JwtPayload){
      return this.JwtService.sign(payload);
  }
}
