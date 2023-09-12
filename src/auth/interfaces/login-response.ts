import { User } from "../entities/user.entity";

export interface LoginResponse{
    User:User;
    token:string;
}
