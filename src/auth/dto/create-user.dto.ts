import { IsIn, IsEmail, IsString, MinLength, Matches, isNumber, IsNumber, IsDateString, IsOptional } from "class-validator";


export class CreateUserDto {
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
    @IsIn(["Mujer","Hombre"], { message: 'Genero debe de ser "Hombre" o "Mujer"' })
    gender:string;
    phone:number;
    @MinLength(10)
    password:string;
    @IsIn(["Admin","User"], { message: 'El atributo de rol debe de ser "Admin" o "User"' })
    UserRole:string;
}
