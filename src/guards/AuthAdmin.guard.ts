import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AdminAuthService } from 'src/admin-auth/admin-auth.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AdminAuthGuard implements CanActivate {
    constructor(
        private authService: AdminAuthService,
        private reflector: Reflector
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const token = this.extractTokenFromHeader(request);
        if (!token) throw new UnauthorizedException('Token not found');
        let payload = this.authService.validate(token);

        if (!payload) throw new UnauthorizedException('Invalid token');

        const user = await this.authService.getUserById(payload.sub);
        if (!user) throw new UnauthorizedException('User not found');
        request['userId'] = user.id;
        request['rolePermissions'] = user.role
        request['username'] = user.username
        //     .map((p) => (p.active === true ? p.permission.alias : null))
        //     .filter((p) => p);

        const rolePermissions = this.reflector.getAllAndOverride<string[]>('rolePermissions', [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!rolePermissions) return true;

        const hasPermission = rolePermissions.some((permission) => request['rolePermissions'].includes(permission));
        if (!hasPermission) throw new ForbiddenException('You do not have permission to access this resource');

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
