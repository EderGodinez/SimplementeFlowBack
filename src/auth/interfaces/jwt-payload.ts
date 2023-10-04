import { User } from "../entities/user.entity";

export interface JwtPayload{
    id:User
    iat?:number;
    exp?:number;
}