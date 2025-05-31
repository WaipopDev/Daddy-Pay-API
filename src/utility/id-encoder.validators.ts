import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { IdEncoderService } from './id-encoder.service';

/**
 * Validator สำหรับตรวจสอบว่า encoded ID ถูกต้องหรือไม่
 */
export function IsValidEncodedId(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isValidEncodedId',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    if (value === null || value === undefined) {
                        return true; // Let other validators handle required validation
                    }
                    
                    if (typeof value !== 'string') {
                        return false;
                    }
                    
                    return IdEncoderService.isValidEncodedId(value);
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} must be a valid encoded ID`;
                }
            }
        });
    };
}

/**
 * Validator สำหรับตรวจสอบ array ของ encoded IDs
 */
export function IsValidEncodedIdArray(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isValidEncodedIdArray',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    if (value === null || value === undefined) {
                        return true; // Let other validators handle required validation
                    }
                    
                    if (!Array.isArray(value)) {
                        return false;
                    }
                    
                    return value.every((item: any) => {
                        if (typeof item !== 'string') {
                            return false;
                        }
                        return IdEncoderService.isValidEncodedId(item);
                    });
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} must be an array of valid encoded IDs`;
                }
            }
        });
    };
}
