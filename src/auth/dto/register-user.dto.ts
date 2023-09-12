import { IsEmail, IsString, MinLength } from "class-validator";


export class RegisterDto {
    @IsEmail()
    email:string;
   @IsString()
    name:string;
   @MinLength(10)
    password:string;
}