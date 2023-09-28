import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
//import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload';
import { AuthService } from '../../auth.service';

// @Injectable()
// export class AuthGuard implements CanActivate {
//   //private jwtService: JwtService,
//   constructor(
//     private AuthService:AuthService) {}
// //  async canActivate(context: ExecutionContext):Promise<boolean>{
// //     const request = context.switchToHttp().getRequest();
// //     const token = this.extractTokenFromHeader(request);
// //     if (!token) {
// //       throw new UnauthorizedException('There is no access token');
// //     }
// //     try {
// //       const payload = await this.jwtService.verifyAsync<JwtPayload>(
// //       token,{secret: process.env.JWT_SECRET});
// //       // 💡 We're assigning the payload to the request object here
// //       // so that we can access it in our route handlers
// //       const user=await this.AuthService.findUserById(payload.id)
// //       if (!user) throw new UnauthorizedException('This user does not exist')
// //       if (!user.isActive) throw new UnauthorizedException('This is not active')
// //       request['user'] = user;
// //     } catch {
// //       throw new UnauthorizedException('invalid token');
// //     }

// //     return Promise.resolve(true);
// //   }
// //   private extractTokenFromHeader(request: Request): string | undefined {
// //     const [type, token] = request.headers['authorization']?.split(' ') ?? [];
// //     return type === 'Bearer' ? token : undefined;
// //   }
// }