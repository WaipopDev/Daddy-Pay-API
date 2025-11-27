import { HttpException } from '@nestjs/common';

/**
 * ดึง error message จาก error object
 * @param error - Error object ที่ต้องการดึง message
 * @param defaultMessage - Message เริ่มต้นถ้าไม่สามารถดึง message ได้
 * @returns Error message string
 */
export function getErrorMessage(error: any, defaultMessage: string = 'An error occurred'): string {
    if (error instanceof HttpException) {
        const response = error.getResponse();
        if (typeof response === 'string') {
            return response;
        } else if (response && typeof response === 'object' && 'message' in response) {
            return (response as any).message;
        } else {
            return error.message || defaultMessage;
        }
    } else if (error instanceof Error) {
        return error.message || defaultMessage;
    } else if (typeof error === 'string') {
        return error;
    }
    
    return defaultMessage;
}

