import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { ExtendedRequest } from 'src/types/extended-request.interface';
import _ from 'lodash';
import { LoggerRepository } from 'src/repositories/Logger.repository';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(
        private loggerRepo: LoggerRepository
    ) { }
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request: ExtendedRequest = context.switchToHttp().getRequest();
        // this.loggerRepo.logActivity({
        //     refId: request['request-id'] || uuidv4(),
        //     role: request?.rolePermissions || 'guest',
        //     userId: request?.userId != null ? Number(request?.userId) : null,
        //     username: request?.username || null,
        //     path: request.url,
        //     method: request.method,
        //     ip: request['user-ip'] || '',
        //     referer: request?.headers?.referer || null,
        //     token: request.headers?.authorization ? request.headers.authorization.replace('Bearer ', '') : null,
        //     payload: _.isEmpty(request.body) ? null : request.body,
        //     response: null,
        // });

        request.isLogger = true;

        return next.handle();
    }
}
