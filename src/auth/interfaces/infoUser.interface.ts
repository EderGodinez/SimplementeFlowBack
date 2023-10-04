
export interface infoUser{
    token:string,
    email:string
}
export class tokenUser implements infoUser{
    token:string
    email:string
    constructor(token:string,email:string){
    this.token=token
    this.email=email
    }
}