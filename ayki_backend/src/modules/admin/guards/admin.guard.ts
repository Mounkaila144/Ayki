import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminRole } from '../../../entities/user.entity';

@Injectable()
export class AdminGuard extends JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // First check if user is authenticated
    const isAuthenticated = await super.canActivate(context);
    if (!isAuthenticated) {
      return false;
    }

    // Then check if user has admin role
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.adminRole) {
      throw new ForbiddenException('Accès refusé : privilèges administrateur requis');
    }

    // Check if user has valid admin role
    const validAdminRoles = [AdminRole.ADMIN, AdminRole.SUPER_ADMIN];
    if (!validAdminRoles.includes(user.adminRole)) {
      throw new ForbiddenException('Accès refusé : rôle administrateur invalide');
    }

    return true;
  }
}
