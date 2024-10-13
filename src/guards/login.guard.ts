import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { Permission } from 'src/permissons/entities/permission.entity';
import { UserService } from 'src/user/user.service';
interface JwtUserData {
  id: string;
  username: string;
  roles: string[];
  permissions: Permission[];
}
declare module 'express' {
  interface Request {
    user?: JwtUserData;
  }
}
export class LoginGuard implements CanActivate {
  @Inject(Reflector)
  private readonly reflector: Reflector;
  @Inject(AuthService)
  private readonly authService: AuthService;
  @Inject(UserService)
  private readonly userService: UserService;
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const http = context.switchToHttp();
    const requireLogin = this.reflector.getAllAndOverride('require-login', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requireLogin) return true;
    const request = http.getRequest<Request>();
    const authorization = request.headers['authorization']?.split(' ')[1];
    if (!authorization) throw new UnauthorizedException();
    const userInfo = this.authService.verify(authorization);
    if (!userInfo) throw new UnauthorizedException();
    request.user = {
      id: userInfo.id,
      username: userInfo.username,
      roles: userInfo.roles,
      permissions: userInfo.permissions,
    };
    return true;
  }
}
