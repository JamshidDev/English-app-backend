import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { AdminRole, CurrentAdmin } from '../../types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<AdminRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const admin = request.user as CurrentAdmin;

    if (!admin) {
      throw new ForbiddenException('Access denied');
    }

    const hasRole = requiredRoles.some((role) => admin.role === role);
    if (!hasRole) {
      throw new ForbiddenException(
        `Required role: ${requiredRoles.join(' or ')}`,
      );
    }

    return true;
  }
}
