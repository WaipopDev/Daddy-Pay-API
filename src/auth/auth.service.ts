import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {

    async getKeyAuth(idIoT: string) {
        return Promise.resolve({
            keyAuth: 'asdfghjkl',
        });
    }
}
