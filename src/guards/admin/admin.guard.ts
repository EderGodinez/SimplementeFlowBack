import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload';
import { AuthService } from '../../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private AuthService:AuthService,private JwtService:JwtService){}
  async canActivate(context: ExecutionContext):Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('No hay token de acceso');
    }
    try {
      const payload = await this.JwtService.verifyAsync<JwtPayload>(
        token,{secret: process.env.JWT_SECRET});
        const user=await this.AuthService.findUserById(payload.id._id)
      if (!user) throw new NotFoundException('Usuario no existe')
      if (!user.isActive) throw new UnauthorizedException('Usuario no activo')
      if (user.UserRole!=='Admin') throw new UnauthorizedException('El usuario no tiene las credenciales para realizar peticion')
      request['user'] = user;
    } catch {
      throw new UnauthorizedException('Token invalido');
    }

    return Promise.resolve(true);
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
