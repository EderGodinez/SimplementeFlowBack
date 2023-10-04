import { Injectable } from '@nestjs/common';
import {createOrderInfo} from './views/orderContent'
import { OrderInfoResponse } from 'src/orders/interfaces/orderinfo.response';
import { infoUser } from 'src/orders/interfaces/infoUser.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/entities/user.entity';
import { ConfirmEmail } from './views/UserConfirm';
//Paquete de envio de correos
const nodemailer = require('nodemailer');
//crear transporter
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: 'eder.godinez9511@alumnos.udg.mx',
      pass: 'iunj wqax murn bdpf'
    },
  });
@Injectable()
export class EmailService {
    constructor(@InjectModel(User.name) 
                private UserModel: Model<User>) {}
    
  async  sendOrderInfo(orderinfo:OrderInfoResponse){
        const userinfo=await this.UserModel.findById(orderinfo.UserId)
        const {data_Address,names,lastnames}=userinfo;
        const username=`${names} ${lastnames}`
        const emailOrderInfo=createOrderInfo(orderinfo,data_Address,username)
        const mailoptions={
            from:`SimplementeFlow <${process.env.NODE_MAILER_USER}>`,
            to:orderinfo.shipping.email,
            subject:"Gracias por tu compra ",
            html:emailOrderInfo
        }
        try {
            await transporter.sendMail(mailoptions);
        } catch (error) {
            console.error("Error al enviar el correo electrónico:", error);
            throw error; // Re-lanza el error para que pueda ser manejado en un nivel superior si es necesario
        }
            
    }
    async sendUserConfirmation(infoUser:infoUser){
        const confirmEmail=ConfirmEmail(infoUser)
        const mailoptions={
            from:`SimplementeFlow<${process.env.NODE_MAILER_USER}>`,
            to:infoUser.email,
            subject:"Confirmar cuenta en Simplemente Flow",
            html:confirmEmail
        }
        try{
            await transporter.sendMail(mailoptions);
        }catch(error){
            console.error("Error al enviar el correo electrónico:", error);
            throw error;
        }
    }
    
}
    