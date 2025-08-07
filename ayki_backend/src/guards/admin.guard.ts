import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new ForbiddenException('Token d\'accès requis');
    }

    try {
      const payload = this.jwtService.verify(token);
      
      // Vérifier si l'utilisateur a un rôle admin
      if (!payload.adminRole) {
        throw new ForbiddenException('Privilèges administrateur requis');
      }

      request.user = payload;
      return true;
    } catch (error) {
      throw new ForbiddenException('Token invalide ou privilèges insuffisants');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
