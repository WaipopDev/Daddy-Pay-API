import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class IdEncoderExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        
        // ตรวจสอบว่าเป็น error จากการ decode ID หรือไม่
        if (exception.message && exception.message.includes('Failed to decode ID')) {
            const errorResponse = {
                statusCode: 400,
                message: 'Invalid ID format',
                error: 'Bad Request',
                details: 'The provided ID is not in the correct encoded format'
            };
            
            return response.status(400).json(errorResponse);
        }
        
        // ถ้าไม่ใช่ error ที่เรา handle ให้ส่งต่อไป
        throw exception;
    }
}
