import { IsIn, IsEmail, IsString, MinLength, Matches, isNumber, IsNumber, IsDateString, IsOptional } from "class-validator";


export class CreateUserDto {
    @IsEmail()
    email:string;
    @IsString()
    @Matches(/^[^\d]+$/,{message:"Lastname does not have to contain numbers"})
    names:string;
    @IsString()
    @Matches(/^[^\d]+$/,{message:"Lastname does not have to contain numbers"})
    lastnames:string;
    @IsDateString()
    birthdate:Date;
    @IsIn(["Male","Female"], { message: 'Gender must to be "Male" or "Female"' })
    gender:string;
    @MinLength(10)
    phone:number;
    @MinLength(10)
    password:string;
    @IsOptional()
    @IsIn(["Admin","User"], { message: 'Role user atribute must to be "Admin" or "User"' })
    UserRole:string;
}
