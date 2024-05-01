// eslint-disable-next-line prettier/prettier
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {
  RegisterUserDto,
  UpdateUserDto,
  LoginDto,
  userAddLike,
  userAddProduct,
} from './dto/index';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  NotImplementedException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import mongoose, { Model } from 'mongoose';
import * as bcryptjs from 'bcryptjs';
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
  constructor(
    @InjectModel(User.name)
    private UserModel: Model<User>,
    @InjectModel(Product.name)
    private ProductModel: Model<Product>,
    private JwtService: JwtService,
    private EmailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async register(RegisterDto:RegisterUserDto): Promise<LoginResponse> {
    const user = await this.create(RegisterDto);
    if (!user.isActive) {
      return null as LoginResponse;
    }
    return {
      User: user,
      token: this.getJWT({ id: user }),
    };
  }
  async create(createUserDto: RegisterUserDto): Promise<User> {
    try {
      const { password, ...userData } = createUserDto;
      const newUser = new this.UserModel({
        password: bcryptjs.hashSync(password, 10),
        ...userData,
      });
      const conditions = [
        { email: userData.email }, // Condición 1: email específico
        { phone: userData.phone }, // Condición 2: phone específico
      ];
      const userExist = await this.UserModel.find({ $or: conditions });
      if (userExist.length > 0) {
        return { isActive: false } as User;
      }
      const { email } = newUser;
      const token = this.getJWT({ id: newUser });
      const UserInfo = new tokenUser(token, email); //Se crea un objeto para pasarlo a enviar el correo
      await this.EmailService.sendUserConfirmation(UserInfo); //Se envia un correo de confirmacion.
      const { password: _, ...user } = newUser.toJSON();
      const objectId = new mongoose.Types.ObjectId();
      user._id = objectId.toString();
      return user;
    } catch (error) {
      throw error;
    }
  }
  async confirmEmail(token: string) {
    try {
      const payload = await this.JwtService.verify<JwtPayload>(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      // El token es válido, y la información está contenida en 'payload'
      const { iat, exp, ...user } = payload;
      const {
        _id,
        data_Address,
        shopping_car,
        likes,
        UserRole,
        isActive,
        ...rest
      } = user.id;
      const newUser = new this.UserModel({
        email: rest.email,
        names: rest.names,
        lastnames: rest.lastnames,
        phone: rest.phone,
        password: rest.password,
        birthdate: rest.birthdate,
        gender: rest.gender,
        UserRole: UserRole,
      }).save();
      //const result =await newUser.save();
      // Redirige al usuario a la URL de Facebook al finalizar el registro

      return 'https://simplemente-flow.netlify.app/NewUser/Success'; // Replace with your desired URL
    } catch (error) {
      // Maneja el error si el token no es válido
      return 'https://simplemente-flow.netlify.app/Error';
    }
  }
  async login(LoginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = LoginDto;
    try {
      const user = await this.UserModel.findOne({ email });
      if (!user) {
        throw new UnauthorizedException('No hay correo vinculado a cuenta');
      }

      if (!bcryptjs.compareSync(password, user.password)) {
        throw new UnauthorizedException('Contraseña incorrecta');
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...rest } = user.toJSON();
      return {
        User: rest,
        token: this.getJWT({ id: user }),
      };
    } catch (error) {
      throw error;
    }
  }
  async addProductAtCar(
    userAddProduct: userAddProduct,
  ): Promise<AddProductResponse> {
    try {
      const { ProductId, UserID, quantity, size } = userAddProduct;
      const productInfo = await this.ProductModel.findById(ProductId);
      const User = await this.UserModel.findById(UserID);
      ///Se busca la talla minima que en caso de no pasar una talla
      let ProductSize = size;
      if (!size) {
        const keymin = Object.keys(productInfo.sizes)
          .filter((key) => productInfo.sizes[key] > 0)
          .map(Number);
        ProductSize = Math.min(...keymin);
      }
      const Exist = User.shopping_car.findIndex(
        (shopping) =>
          shopping.ProductId === ProductId && shopping.size === ProductSize,
      );
      if (Exist != -1) {
        // Luego, realiza otra actualización para incrementar la cantidad
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const updatedUser = await this.UserModel.findOneAndUpdate(
          {
            _id: User._id,
            'shopping_car.ProductId': ProductId,
            'shopping_car.size': ProductSize,
          },
          {
            $inc: {
              'shopping_car.$.quantity': quantity,
            },
          },
          { new: true },
        );
      } else {
        const resp = await this.UserModel.findByIdAndUpdate(
          UserID,
          {
            $addToSet: {
              shopping_car: {
                $each: [
                  {
                    ProductId: ProductId,
                    size: ProductSize,
                    quantity: quantity,
                  },
                ],
              },
            },
          },
          { new: true },
        );
        if (!resp) {
          throw (
            (new NotFoundException(
              'Error al intentar agregar producto a carrito',
            ),
            HttpStatus.BAD_REQUEST)
          );
        }
      }

      return {
        message: `Producto ${productInfo.ProductName} agregado a carrito`,
        status: 200,
      };
    } catch (error) {
      throw error;
    }
  }
  async addLikes(userAddLike: userAddLike): Promise<AddProductResponse> {
    try {
      const productInfo = await this.ProductModel.findById(
        userAddLike.productId,
      );
      if (!productInfo)
        throw (
          (new NotFoundException('Producto no existe'), HttpStatus.NOT_FOUND)
        );
      const user = await this.UserModel.findById(userAddLike.UserID);
      if (!user)
        throw (
          (new NotFoundException('Usuario no existe'), HttpStatus.NOT_FOUND)
        );
      if (user.likes.includes(userAddLike.productId)) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const resp = await this.UserModel.findOneAndUpdate(
          { _id: userAddLike.UserID },
          { $pull: { likes: userAddLike.productId } },
          { new: true },
        );
        return {
          message: `Producto ${productInfo.ProductName} eliminado de favoritos`,
          status: 200,
        };
      }
      const resp = await this.UserModel.findOneAndUpdate(
        { _id: userAddLike.UserID },
        { $push: { likes: userAddLike.productId } },
      );
      if (!resp)
        throw (
          (new NotImplementedException(
            'Error al intentar agregar producto ' + productInfo.ProductName,
          ),
          HttpStatus.CONFLICT)
        );
      return {
        message: `Producto ${productInfo.ProductName} agregado a tu lista de favoritos`,
        status: 200,
      };
    } catch (error) {
      throw error;
    }
  }
  async findUserById(UserId: string) {
    const user = await this.UserModel.findById(UserId);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user.toJSON();
    return rest;
  }
  findAll(): Promise<User[]> {
    return this.UserModel.find();
  }

  findOne(id: string) {
    return this.UserModel.findById(id);
  }

  async update(id: string, UpdateUserDto: UpdateUserDto): Promise<UserUpdated> {
    try {
      const userUpdated = await this.UserModel.findOneAndUpdate(
        { _id: id },
        UpdateUserDto,
        { new: true }, // Opción para devolver el documento actualizado
      ).lean();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...UserData } = userUpdated;
      return UserData;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          `Numero de telefono ${UpdateUserDto.phone} ya esta vinculado a una cuenta`,
        );
      }
    }
  }
  remove(id: number) {
    return this.UserModel.findByIdAndDelete(id);
  }
  getJWT(payload: JwtPayload) {
    return this.JwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
  }
  async getUsername(id: string) {
    try {
      const resp = await this.UserModel.findById(id)
        .select('names lastnames')
        .exec();
      if (!resp) {
        throw new Error('Usuario no encontrado');
      }
      const { names, lastnames } = resp;
      return { username: `${names} ${lastnames}` };
    } catch (error) {
      throw new Error('Error al obtener el nombre de usuario');
    }
  }
  async GetTotalUsers() {
    const total = await this.UserModel.find().count().exec();
    return { TotalUsers: total };
  }
  async changePassword(Info: ChangePasswordDto) {
    const { email, newPassword, _password } = Info;
    try {
      const user = await this.UserModel.findOne({ email });
      if (!user) {
        throw new UnauthorizedException('No hay correo vinculado a cuenta');
      }
      if (!bcryptjs.compareSync(_password, user.password)) {
        throw new UnauthorizedException('Contraseña incorrecta');
      }
      if (bcryptjs.compareSync(newPassword, user.password)) {
        throw new NotAcceptableException(
          'La contraseña nueva no puede ser igual a la actual',
        );
      }
      const EncryptPass: string = bcryptjs.hashSync(newPassword, 10);
      const UserUpdated = await this.UserModel.findOneAndUpdate(
        { email: email },
        { password: EncryptPass },
      ).lean();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = UserUpdated;
      return rest;
    } catch (error) {
      throw error;
    }
  }
}
