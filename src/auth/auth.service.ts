

import {CreateUserDto,UpdateUserDto,LoginDto,RegisterDto,userAddLike,userAddProduct} from './dto/index'
import { BadRequestException, Injectable , InternalServerErrorException, NotAcceptableException, UnauthorizedException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import mongoose, { Model } from 'mongoose';
import * as bcryptjs from 'bcryptjs'
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response';
import { EmailService } from 'src/email/email.service';
import { tokenUser } from './interfaces/infoUser.interface';
import { Product } from 'src/products/entities/product.entity';
import { ConfigService } from '@nestjs/config';
import { UserUpdated } from './interfaces/UserUpdated.interface';
import { ChangePasswordDto } from './dto/changePassword.dto';
@Injectable()
export class AuthService {
  
  constructor(@InjectModel(User.name) 
              private UserModel: Model<User>,
              @InjectModel(Product.name) 
              private ProductModel: Model<Product>,
              private JwtService:JwtService,
              private EmailService:EmailService,
              private readonly configService: ConfigService) {}
   
async register(RegisterDto:RegisterDto):Promise<LoginResponse>{  
  const user=await this.create(RegisterDto);
  if(!user.isActive){
    return null as LoginResponse
  }
  return{
    User:user,
    token:this.getJWT({ id:user }),
  }
}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...userData } = createUserDto;  
      const newUser = new this.UserModel({
       password: bcryptjs.hashSync( password, 10 ),
       ...userData
      });
      const conditions = [
        { email: userData.email }, // Condición 1: email específico
        { phone: userData.phone }, // Condición 2: phone específico
      ];
      const userExist=await this.UserModel.find({$or: conditions});
      if(userExist.length>0){
        return {isActive:false} as User
      }
      const {email}=newUser;
      const token=this.getJWT({id:newUser})
      const UserInfo = new tokenUser(token,email); //Se crea un objeto para pasarlo a enviar el correo
     await this.EmailService.sendUserConfirmation(UserInfo)//Se envia un correo de confirmacion.   
       const { password:_, ...user } = newUser.toJSON();
       const objectId =new mongoose.Types.ObjectId();
       user._id=objectId.toString()
       return user;
  }
  async confirmEmail(token:string) {
    try {
      const payload = await this.JwtService.verify<JwtPayload>(token,{secret: this.configService.get<string>('JWT_SECRET')});
      // El token es válido, y la información está contenida en 'payload'
      const {iat,exp,...user}=payload;
      const {_id,data_Address,shopping_car,likes,UserRole,isActive,...rest}=user.id
      const newUser = new this.UserModel(
        {
          email:rest.email,
          names:rest.names,
          lastnames:rest.lastnames,
          phone:rest.phone,
          password:rest.password,
          birthdate:rest.birthdate,
          gender:rest.gender,
          UserRole:UserRole
        }
      ).save();
      //const result =await newUser.save();
      // Redirige al usuario a la URL de Facebook al finalizar el registro
      
      return 'http://localhost:4200/SimplementeFlow/NewUser/Success'; // Replace with your desired URL
    } catch (error) {
      // Maneja el error si el token no es válido
      return 'http://localhost:4200/Error'
    }
    
  }
  async login(LoginDto:LoginDto):Promise<LoginResponse>{
    const {email,password}=LoginDto;
    try{
      const user =await this.UserModel.findOne({email});
      if (!user) {
        throw new UnauthorizedException('No hay correo vinculado a cuenta')
      }

      if (!bcryptjs.compareSync(password,user.password)) {
        throw new UnauthorizedException('Contraseña incorrecta')
      }
      
      const {password:_,...rest}=user.toJSON()
      return{
        User:rest,
        token:this.getJWT({ id:user }),
      }
    }
    catch(error){
      throw error 
    }
    
}
async addProductAtCar(userAddProduct:userAddProduct) :Promise<AddProductResponse> {
  try{
    const productInfo=await this.ProductModel.findById(userAddProduct.productId)
    const resp=await this.UserModel.findByIdAndUpdate(userAddProduct.UserID, { $push: {shopping_car: userAddProduct.productId }},{ new: true })
    return{
      message:`product ${productInfo.ProductName} added to your shopping car`,
      status:200
    }
  }catch(error){
    return{
      message:`Error when trying to add product at shopping car`,
      status:400
    }
  }
  

}
async addLikes(userAddLike:userAddLike) :Promise<AddProductResponse>{
  const productInfo=await this.ProductModel.findById(userAddLike.productId)
  try{
    const resp=await this.UserModel.findByIdAndUpdate(userAddLike.UserID, { $push: {likes: userAddLike.productId }},{ new: true })
  }
  catch(error){
    return{
      message:`Error when trying to add product ${productInfo.ProductName} at wishlist`,
      status:400
    }
  }
  return{
    message:`product ${productInfo.ProductName} added to your shopping car`,
    status:200
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

  findOne(id: string) {
    return this.UserModel.findById(id);
  }

 async update(id: string, UpdateUserDto: UpdateUserDto):Promise<UserUpdated> {
  try {
    const userUpdated = await this.UserModel.findOneAndUpdate(
      { _id: id }, 
      UpdateUserDto,
      { new: true } // Opción para devolver el documento actualizado
    ).lean();
      const {password,...UserData}=userUpdated
    return UserData
  } catch (error) {
    if( error.code === 11000 ) {
      throw new BadRequestException(`Numero de telefono ${ UpdateUserDto.phone } ya esta vinculado a una cuenta`)
    }
  }  
  }
  remove(id: number) {
    return this.UserModel.findByIdAndDelete(id);
  }
  getJWT(payload:JwtPayload){
      return this.JwtService.sign(payload,{secret: this.configService.get<string>('JWT_SECRET')});
  }
  async getUsername(id:string){
    try {
      const resp = await this.UserModel.findById(id).select('names lastnames').exec();
      if (!resp) {
        throw new Error('Usuario no encontrado');
      }
      const { names, lastnames } = resp;
      return {username:`${names} ${lastnames}`}
    } catch (error) {
      throw new Error('Error al obtener el nombre de usuario');
    }
  }
  async GetTotalUsers(){
    const total=await this.UserModel.find().count().exec()
    return{TotalUsers:total}
  }
  async changePassword(Info:ChangePasswordDto){
    const {email,newPassword,_password}=Info
    try{
      const user =await this.UserModel.findOne({email});
      if (!user) {
        throw new UnauthorizedException('No hay correo vinculado a cuenta')
      }
      if (!bcryptjs.compareSync(_password,user.password)) {
        throw new UnauthorizedException('Contraseña incorrecta')
      }
      if (bcryptjs.compareSync(newPassword,user.password)) {
        throw new NotAcceptableException('La contraseña nueva no puede ser igual a la actual')
      }
      const EncryptPass:string=bcryptjs.hashSync( newPassword, 10 )
      const UserUpdated=await this.UserModel.findOneAndUpdate({email:email},{password:EncryptPass}).lean()
      const{password,...rest}=UserUpdated
      return rest
    }
    catch(error){
      throw error 
    }
    
  }
}
