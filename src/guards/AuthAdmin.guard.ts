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
        const response = context.switchToHttp().getResponse();

        const token = this.extractTokenFromHeader(request);
        if (!token) throw new UnauthorizedException('Token not found');
        
        // ตรวจสอบและ refresh token ถ้าจำเป็น
        let tokenResult;
        try {
            tokenResult = await this.authService.checkAndRefreshToken(token);
        } catch (error) {
            // ถ้า token หมดอายุ ให้ set header เพื่อแจ้ง frontend
            if (error instanceof UnauthorizedException && error.message === 'Token expired') {
                response.setHeader('X-Token-Expired', 'true');
            }
            throw error;
        }
        response.setHeader('X-Token-Refreshed', 'true');
        if (!tokenResult.payload) throw new UnauthorizedException('Invalid token');

        // ถ้า token ถูก refresh ให้ส่ง token ใหม่กลับผ่าน header
        if (tokenResult.shouldRefresh && tokenResult.newToken) {
            response.setHeader('X-New-Token', tokenResult.newToken);
            response.setHeader('X-Token-Refreshed', 'true');
        }

        const user = await this.authService.getUserById(tokenResult.payload.sub);
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
