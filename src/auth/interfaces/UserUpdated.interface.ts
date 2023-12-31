import { User } from "../entities/user.entity";

export interface UserUpdated extends Omit<User, 'password'>{

}