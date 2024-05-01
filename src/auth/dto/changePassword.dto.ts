import { IsEmail, IsString, MinLength } from "class-validator"

export class ChangePasswordDto{
    @IsString({message:'El correo debe de ser ser en formato string'})
    @MinLength(8,{message:'El correo invalido , correo debe de tener minimo de 8 caracteres'})
    @IsEmail({},{message:'Correo invalido'})
    email:string
    @IsString({message:'La contraseña debe de ser ser en formato string'})
    @MinLength(10,{message:'El correo invalido , correo debe de tener minimo de 10 caracteres'})
    _password:string
    @IsString({message:'La contraseña debe de ser ser en formato string'})
    @MinLength(10,{message:'El correo invalido , correo debe de tener minimo de 10 caracteres'})
    newPassword:string
}