import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload';
import { AuthService } from '../../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
      private jwtService: JwtService,
    private AuthService:AuthService) {}
 async canActivate(context: ExecutionContext):Promise<boolean>{
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('There is no access token');
    }
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        token,{secret: process.env.JWT_SECRET});
        const user=await this.AuthService.findUserById(payload.id._id)
      if (!user) throw new UnauthorizedException('Usuario no existe')
      if (!user.isActive) throw new UnauthorizedException('Usuario no activo')
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
