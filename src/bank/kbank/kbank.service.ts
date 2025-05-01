import { Injectable, Logger } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { KB_CALLBACK } from 'src/constants/collection-firebase';
import axios from 'axios';
import * as fs from 'fs';
import * as https from 'https';
import { ConfigService } from '@nestjs/config';
import moment from 'moment';
@Injectable()
export class KbankService {
    private readonly logger = new Logger(KbankService.name);
    constructor(
        private readonly firebaseService: FirebaseService,
        private readonly configService: ConfigService
    ) { }

    async setDataCallback(data: any): Promise<void> {
        try {
            const firestore = this.firebaseService.getFirestore();
            const docRef = firestore.collection(KB_CALLBACK);
            await docRef.add(data);
        } catch (error) {
            console.error('Error adding document: ', error);
            throw error;
        }
    }

    async generateKbank(data: { amount: number }): Promise<void> {
        try {
            const token = await this.getAccessToken();
            const authHeader = `Bearer ${token.access_token}`;
            const url = `${this.configService.get('OAUTH_KL')}/v1/qrpayment/request`;
            const keyPath = this.configService.get('KEY_PATH');
            const certPath = this.configService.get('CERT_PATH');
            const key = fs.readFileSync(keyPath);
            const cert = fs.readFileSync(certPath);

            const httpsAgent = new https.Agent({ key, cert });
            const now = moment();
            console.log("🚀 ~ KbankService ~ generateKbank ~ httpsAgent:", httpsAgent)
            const param = {
                merchantId: this.configService.get('MERCHANT_ID_KL'),
                partnerId: this.configService.get('PARTNER_ID_KL'),
                partnerSecret: this.configService.get('PARTNER_SECRET_KL'),
                partnerTxnUid: `UAT${now.unix()}`,
                qrType: '3',
                reference1: `INV${now.format('YYYYMMDD')}`,
                reference2: `INV${now.unix()}`,
                reference3: '',
                reference4: '',
                requestDt: new Date().toISOString(),
                txnAmount: data.amount,
                txnCurrencyCode: 'THB',
            };
            return await axios.post(url, param, {
                headers: {
                    Authorization: authHeader,
                    'Content-Type': 'application/json',
                    'env-id': 'QR002',
                },
                httpsAgent,
            });
        } catch (error) {
            console.error('Error adding document: ', error.response?.data);
            throw new Error(error?.message || 'OAuthKL token request failed');;
        }
    }
    async createHttpsAgent() {
        const keyPath = this.configService.get('KEY_PATH');
        const certPath = this.configService.get('CERT_PATH');
        const key = fs.readFileSync(keyPath);
        const cert = fs.readFileSync(certPath);
        return {
            agent: new https.Agent({ key, cert }),
        };
    }
    async getAccessToken(): Promise<any> {
        try {
            const url = `${this.configService.get('OAUTH_KL')}/v2/oauth/token`;
            const payload = 'grant_type=client_credentials';

            const consumerId = this.configService.get('CONSUMER_ID_KL');
            const consumerSecret = this.configService.get('CONSUMER_SECRET_KL');

            const encoded = Buffer.from(`${consumerId}:${consumerSecret}`).toString('base64');
            const authHeader = `Basic ${encoded}`;

            const keyPath = this.configService.get('KEY_PATH');
            const certPath = this.configService.get('CERT_PATH');
            const key = fs.readFileSync(keyPath);
            const cert = fs.readFileSync(certPath);

            const httpsAgent = new https.Agent({ key, cert });

           
            const response = await axios.post(url, payload, {
                headers: {
                    Authorization: authHeader,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                httpsAgent,
            });
            console.log("🚀 ~ KbankService ~ getAccessToken ~ httpsAgent:", response.data)
            return response.data;
        } catch (error) {
            this.logger.error('OAuthKL Token Error:', error.response?.data);
            throw new Error(error?.message || 'OAuthKL token request failed');
        }
    }

}
