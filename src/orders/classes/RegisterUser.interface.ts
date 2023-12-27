interface RegisterU{
    totalUsers:any
    month:any
}
export class RegisterUser implements RegisterU {
    totalUsers: any;
    month: any;
    // Constructor adicional con parámetro opcional
    constructor(total?: any, month?: any) {
      this.totalUsers = total||0;
      this.month = month || 0;
    }
  }   
