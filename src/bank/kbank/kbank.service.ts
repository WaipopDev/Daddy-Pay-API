import { Injectable, Logger } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { KB_AUTH, KB_CALLBACK } from 'src/constants/collection-firebase';
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
            const setData = {
                ...data,
                createdAt: new Date(),
            }
            await docRef.add(setData);
        } catch (error) {
            console.error('Error adding document: ', error);
            throw error;
        }
    }

    async generateKbank(data: { amount: number, partnerTxnUid: string }): Promise<void> {
        try {
            const firestore = this.firebaseService.getFirestore();
            const docRef = firestore.collection(KB_AUTH);
            const doc = await docRef.doc('auth').get();
            let access_token: string = '';
            if (doc.exists) {
                const dataToken = doc.data();

                if (dataToken?.expired) {
                    const now = moment();
                    const expired = moment(dataToken.expired);

                    // เช็คว่าเกิน 29 นาทีหรือยัง (ถ้า now > expired - 29 นาที)
                    if (now.isBefore(expired.clone().subtract(29, 'minutes'))) {
                        access_token = dataToken.access_token; // ยังไม่เกิน 29 นาที
                    }else{
                        // ถ้าเกิน 29 นาที
                        const token = await this.getAccessToken();
                        access_token = token.access_token;
                        const expired = moment().add(token.expires_in, 'seconds');
                        await docRef.doc('auth').set({
                            access_token: token.access_token,
                            expired: expired.toISOString(),
                        });
                    }
                }
            }else{
                // ถ้าไม่มีข้อมูลใน Firestore
                const token = await this.getAccessToken();
                access_token = token.access_token;
                const expired = moment().add(token.expires_in, 'seconds');
                await docRef.doc('auth').set({
                    access_token: token.access_token,
                    expired: expired.toISOString(),
                });
            }


            const authHeader = `Bearer ${access_token}`;
            const url = `${this.configService.get('OAUTH_KL')}/v1/qrpayment/request`;
            const { agent } = await this.createHttpsAgent();
            const now = moment();
            const param = {
                merchantId: this.configService.get('MERCHANT_ID_KL'),
                partnerId: this.configService.get('PARTNER_ID_KL'),
                partnerSecret: this.configService.get('PARTNER_SECRET_KL'),
                partnerTxnUid: data.partnerTxnUid,
                qrType: '3',
                reference1: `INV${now.format('YYYYMMDD')}`,
                reference2: `INV${now.unix()}`,
                reference3: '',
                reference4: '',
                requestDt: new Date().toISOString(),
                txnAmount: data.amount,
                txnCurrencyCode: 'THB',
            };
            const response = await axios.post(url, param, {
                headers: {
                    Authorization: authHeader,
                    'Content-Type': 'application/json',
                    'env-id': 'QR002',
                },
                httpsAgent: agent,
            });
            return response.data;
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

            const { agent } = await this.createHttpsAgent();

            // const httpsAgent = new https.Agent({ key, cert });


            const response = await axios.post(url, payload, {
                headers: {
                    Authorization: authHeader,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                httpsAgent: agent,
            });
            return response.data;
        } catch (error) {
            this.logger.error('OAuthKL Token Error:', error);
            throw new Error(error?.message || 'OAuthKL token request failed');
        }
    }

    async generateKbankQRPayment(data: { amount: number, partnerTxnUid: string, ref1: string, ref2: string, ref3: string, ref4: string }): Promise<{ qrCode: string }> {
        try {
            const firestore = this.firebaseService.getFirestore();
            const docRef = firestore.collection(KB_AUTH);
            const doc = await docRef.doc('auth').get();
            let access_token: string = '';
            if (doc.exists) {
                const dataToken = doc.data();

                if (dataToken?.expired) {
                    const now = moment();
                    const expired = moment(dataToken.expired);

                    // เช็คว่าเกิน 29 นาทีหรือยัง (ถ้า now > expired - 29 นาที)
                    if (now.isBefore(expired.clone().subtract(29, 'minutes'))) {
                        access_token = dataToken.access_token; // ยังไม่เกิน 29 นาที
                    }else{
                        // ถ้าเกิน 29 นาที
                        const token = await this.getAccessToken();
                        access_token = token.access_token;
                        const expired = moment().add(token.expires_in, 'seconds');
                        await docRef.doc('auth').set({
                            access_token: token.access_token,
                            expired: expired.toISOString(),
                        });
                    }
                }
            }else{
                // ถ้าไม่มีข้อมูลใน Firestore
                const token = await this.getAccessToken();
                access_token = token.access_token;
                const expired = moment().add(token.expires_in, 'seconds');
                await docRef.doc('auth').set({
                    access_token: token.access_token,
                    expired: expired.toISOString(),
                });
            }


            const authHeader = `Bearer ${access_token}`;
            const url = `${this.configService.get('OAUTH_KL')}/v1/qrpayment/request`;
            const { agent } = await this.createHttpsAgent();
            // const now = moment();
            const param = {
                merchantId: this.configService.get('MERCHANT_ID_KL'),
                partnerId: this.configService.get('PARTNER_ID_KL'),
                partnerSecret: this.configService.get('PARTNER_SECRET_KL'),
                partnerTxnUid: data.partnerTxnUid,
                qrType: '3',
                reference1: data.ref1,
                reference2: data.ref2,
                reference3: data.ref3,
                reference4: data.ref4,
                requestDt: new Date().toISOString(),
                txnAmount: data.amount,
                txnCurrencyCode: 'THB',
            };
            const response = await axios.post(url, param, {
                headers: {
                    Authorization: authHeader,
                    'Content-Type': 'application/json',
                    'env-id': 'QR002',
                },
                httpsAgent: agent,
            });
            return {
                qrCode: response.data.qrCode,
            };
        } catch (error) {
            console.error('Error adding document: ', error.response?.data);
            throw new Error(error?.message || 'OAuthKL token request failed');;
        }
    }

    async checkPayment(data: { ref1: string, ref2: string }): Promise<{
        transactionId: string;
        status: string;
        amount: number;
        reference1: string;
        reference2: string;
    } | null> {
        const firestore = this.firebaseService.getFirestore();
        const docRef = firestore.collection(KB_CALLBACK);
        const doc = await docRef.where('reference1', '==', data.ref1).where('reference2', '==', data.ref2).get();
        if (doc.empty) {
            return {
                transactionId: '',
                status: 'failed',
                amount: 0,
                reference1: '',
                reference2: '',
            };
        }
        return {
            transactionId: doc.docs[0].data().txnNo || '',
            status: 'success',
            amount: doc.docs[0].data().txnAmount || 0,
            reference1: doc.docs[0].data().reference1 || '',
            reference2: doc.docs[0].data().reference2 || '',
        };
    }

}
