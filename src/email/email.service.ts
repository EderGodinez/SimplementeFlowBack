import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import {createOrderInfo} from './views/orderContent'
import { OrderInfoResponse } from 'src/orders/interfaces/orderinfo.response';
import { infoUser } from 'src/orders/interfaces/infoUser.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/entities/user.entity';
import { ConfirmEmail } from './views/UserConfirm';
import { ConfigService } from '@nestjs/config';
//Paquete de envio de correos
const nodemailer = require('nodemailer');
//crear transporter

@Injectable()
export class EmailService {
    
    constructor(@InjectModel(User.name) 
                private UserModel: Model<User>,
                private readonly configService: ConfigService) {}
            
                transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 587,
                    secure: false, // upgrade later with STARTTLS
                    auth: {
                      user:this.configService.get<string>('NODE_MAILER_USER'),
                      pass:this.configService.get<string>('NODE_MAILER_PASS')
                        },
                  });
  async  sendOrderInfo(orderinfo:OrderInfoResponse){
        const userinfo=await this.UserModel.findById(orderinfo.UserId)
        const {data_Address,names,lastnames}=userinfo;
        const username=`${names} ${lastnames}`
        const emailOrderInfo=createOrderInfo(orderinfo,data_Address,username)
        const mailoptions={
            from:`SimplementeFlow <${this.configService.get<string>('NODE_MAILER_USER')}>`,
            to:orderinfo.shipping.email,
            subject:"Gracias por tu compra ",
            html:emailOrderInfo
        }
        try {
            await this.transporter.sendMail(mailoptions);
        } catch (error) {
            console.error("Error al enviar el correo electrónico:", error);
            throw new  error; // Re-lanza el error para que pueda ser manejado en un nivel superior si es necesario
        }
            
    }
    async sendUserConfirmation(infoUser:infoUser){
        const confirmEmail=ConfirmEmail(infoUser)
        const mailoptions={
            from:`SimplementeFlow<${this.configService.get<string>('NODE_MAILER_USER')}>`,
            to:infoUser.email,
            subject:"Confirmar cuenta en Simplemente Flow",
            html:confirmEmail
        }
        try{
           const resp= await this.transporter.sendMail(mailoptions);
           if (!resp) {
            throw new NotFoundException('Correo proporcionado no existe'),HttpStatus.NOT_FOUND
           }
        }catch(error){
            console.error("Error al enviar el correo electrónico:", error);
            throw new error;
        }
    }
}
    