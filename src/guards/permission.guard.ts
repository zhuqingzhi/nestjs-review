import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

export class PermissionGuard implements CanActivate {
  @Inject(Reflector)
  private readonly reflector: Reflector;
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const http = context.switchToHttp();
    const requiredPermissions = this.reflector.getAllAndOverride(
      'require-permission',
      [context.getClass(), context.getHandler()],
    );
    if (!requiredPermissions) return true;
    const user = http.getRequest().user;
    if (!user) return true;
    const userPermissions: string[] = user.permissions;
    console.log(userPermissions, requiredPermissions);
    //同时满足requirePermission
    requiredPermissions.forEach((item) => {
      if (!userPermissions.includes(item))
        throw new UnauthorizedException('用户没有权限' + item);
    });
    return true;
  }
}
