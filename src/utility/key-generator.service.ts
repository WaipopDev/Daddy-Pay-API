import { Injectable } from '@nestjs/common';

@Injectable()
export class KeyGeneratorService {
    /**
     * Generate a random key with specified length using alphanumeric characters
     * @param length - The length of the key to generate
     * @returns A random alphanumeric string
     */
    static generateRandomKey(length: number): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';

        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        return result;
    }

    /**
     * Generate a random key with custom character set
     * @param length - The length of the key to generate
     * @param customCharacters - Custom character set to use
     * @returns A random string using the custom character set
     */
    static generateCustomKey(length: number, customCharacters: string): string {
        let result = '';

        for (let i = 0; i < length; i++) {
            result += customCharacters.charAt(Math.floor(Math.random() * customCharacters.length));
        }

        return result;
    }

    /**
     * Generate a numeric-only key
     * @param length - The length of the key to generate
     * @returns A random numeric string
     */
    static generateNumericKey(length: number): string {
        const numbers = '0123456789';
        return this.generateCustomKey(length, numbers);
    }

    /**
     * Generate an alphabetic-only key
     * @param length - The length of the key to generate
     * @param uppercase - Whether to use uppercase letters (default: true)
     * @returns A random alphabetic string
     */
    static generateAlphabeticKey(length: number, uppercase: boolean = true): string {
        const letters = uppercase ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : 'abcdefghijklmnopqrstuvwxyz';
        return this.generateCustomKey(length, letters);
    }
}
