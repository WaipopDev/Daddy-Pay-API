import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class ApplicationMiddleware {
    use(req, res, next) {
        req['request-id'] = uuidv4();
        req['user-ip'] = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log('re', req['user-ip'])
        next();
    }
}
