import { IsDateString, IsEmail, IsIn, IsOptional, IsString, Matches, MinLength } from "class-validator";


export class RegisterDto {
    @IsEmail()
    email:string;
    @IsString()
    @Matches(/^[^\d]+$/,{message:"Nombre no puede contener numeros"})
    names:string;
    @IsString()
    @Matches(/^[^\d]+$/,{message:"Apellido no puede contener numeros"})
    lastnames:string;
    @IsDateString()
    birthdate:Date;
    @IsIn(["Mujer","Hombre","Otro"], { message: 'Genero debe de ser "Hombre" o "Mujer"' })
    gender:string;
    @MinLength(10)
    phone:number;
    @MinLength(10)
    password:string;
    @IsOptional()
    @IsIn(["Admin","User"], { message: 'El atributo de rol debe de ser "Admin" o "User"' })
    UserRole:string;
}