import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { KB_CALLBACK } from 'src/constants/collection-firebase';
import { FirebaseService } from 'src/firebase/firebase.service';
import { IotPaymentCheckPaymentRequestDto, IotPaymentQRPaymentRequestDto } from './dto/iot-payment.dto';
import { KbankService } from 'src/bank/kbank/kbank.service';
import { MachineProgramRepository } from 'src/repositories/MachineProgram.repository';
import { ShopManagementRepository } from 'src/repositories/ShopManagement.repository';
import moment from 'moment';
import { ShopInfoRepository } from 'src/repositories/ShopInfo.repository';

@Injectable()
export class IotPaymentService {
    private readonly logger = new Logger(IotPaymentService.name);
    constructor(
        private readonly firebaseService: FirebaseService,
        private readonly kbankService: KbankService,
        private readonly machineProgramRepository: MachineProgramRepository,
        private readonly shopManagementRepository: ShopManagementRepository,
        private readonly shopInfoRepository: ShopInfoRepository,
    ) { }

    async getQRPayment(query: IotPaymentQRPaymentRequestDto) {
        const programInfo = await this.machineProgramRepository.findByIdAndKey(query.id, query.machineProgramKey);
        if (!programInfo) {
            throw new BadRequestException('Invalid program ID or key');
        }

        const shopManagement = await this.shopManagementRepository.findByIdIoT(query.iotId);
        
        if (!shopManagement) {
            throw new BadRequestException('Machine not found');
        }
        const shopInfo = await this.shopInfoRepository.findBankById(shopManagement.shopInfoID);
        if (!shopInfo) {
            throw new BadRequestException('Shop info not found');
        }
        let bankActive: { MERCHANT_ID: string, PARTNER_ID: string, PARTNER_SECRET: string } = {
            MERCHANT_ID: '',
            PARTNER_ID: '',
            PARTNER_SECRET: '',
        };
        if(shopInfo.bankActiveId && shopInfo.bankActive.param){
            bankActive = {
                MERCHANT_ID : shopInfo.bankActive.param?.merchantId || '',
                PARTNER_ID : shopInfo.bankActive.param?.partnerId || '',
                PARTNER_SECRET : shopInfo.bankActive.param?.partnerSecret || '',
            }
        }
        // console.log('programInfo', programInfo)
        // console.log('shopManagement', shopManagement)
        const data = {
            amount: programInfo.machineProgramPrice,
            partnerTxnUid: `KPROD${moment().unix()}`,
            ref1: programInfo.machineProgramKey,
            ref2: `TRX${moment().unix()}`,
            ref3: shopManagement.shopManagementKey,
            ref4: shopManagement.shopInfoID.toString(),
        }
        const response: { qrCode: string } = await this.kbankService.generateKbankQRPayment(data, bankActive);

        return {
            qrRawData: response?.qrCode,
            ref1: data.ref1,
            ref2: data.ref2,
        };
    }

    async checkPayment(query: IotPaymentCheckPaymentRequestDto) {
        const response = await this.kbankService.checkPayment(query);
        return response;
    }
    // async getTransactionBankId(transactionId: string): Promise<string> {
    //     const firestore = this.firebaseService.getFirestore();
    //     const docRef = firestore.collection(KB_CALLBACK);
    //     const doc = await docRef.doc(transactionId).get();
    //     if (!doc.exists) {
    //         return null;
    //     }
    //     return doc.data();
    // }
}
