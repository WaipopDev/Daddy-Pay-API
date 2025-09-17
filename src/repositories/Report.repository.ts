import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, FindOptionsWhere } from 'typeorm';
import { LangMainEntity } from 'src/models/entities/LangMain.entity';
import { LangListEntity } from 'src/models/entities/LangList.entity';
import { ResponseLanguageDto } from 'src/language/dto/language.dto';
import { MachineTransactionEntity } from 'src/models/entities/MachineTransaction.entity';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { ReportBranchIncomeDto, ReportKbankPaymentDto } from 'src/report/dto/report.dto';
import { FirebaseService } from 'src/firebase/firebase.service';
import { KB_CALLBACK } from 'src/constants/collection-firebase';
import { IdEncoderService } from 'src/utility/id-encoder.service';
import { ShopManagementEntity } from 'src/models/entities/ShopManagement.entity';
import { ShopInfoEntity } from 'src/models/entities/ShopInfo.entity';
import { ProgramInfoEntity } from 'src/models/entities/ProgramInfo.entity';
import { MachineProgramEntity } from 'src/models/entities/MachineProgram.entity';

export class ReportRepository {
    constructor(
        @InjectEntityManager() private readonly db: EntityManager,
        private readonly firebaseService: FirebaseService,
    ) { }

    private get repo() {
        return this.db.getRepository(MachineTransactionEntity);
    }

    private get repoShopManagement() {
        return this.db.getRepository(ShopManagementEntity);
    }

    private get repoShopInfo() {
        return this.db.getRepository(ShopInfoEntity);
    }

    private get repoProgramInfo() {
        return this.db.getRepository(ProgramInfoEntity);
    }

    private get repoMachineProgram() {
        return this.db.getRepository(MachineProgramEntity);
    }

    async findBranchIncome(query: ReportBranchIncomeDto) {
        const { startDate, endDate, page, limit } = query;
        const queryBuilder = this.repo.createQueryBuilder('machineTransaction');

        const startOfDay = new Date(startDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);

        queryBuilder.select([
            'machineTransaction.id',
            'machineTransaction.shopInfoId',
            'machineTransaction.priceType',
            'machineTransaction.price',
            'machineTransaction.createdAt',
            'machineTransaction.transactionId',
            'machineTransaction.transactionIot',
        ]);
        queryBuilder.addSelect([
            'shopInfo.shopName',
            'machineInfo.machineType',
            'shopManagement.shopManagementName',
            'programInfo.programName',
        ]);

        queryBuilder.where('machineTransaction.deletedAt IS NULL');
        queryBuilder.andWhere('machineTransaction.createdAt >= :startDate', { startDate: startOfDay });
        queryBuilder.andWhere('machineTransaction.createdAt <= :endDate', { endDate: endOfDay });

        if (query.branchId) {
            const branchId = IdEncoderService.decode(query.branchId);
            queryBuilder.andWhere('machineTransaction.shopInfoId = :branchId', { branchId: branchId });
        }
        if (query.paymentType) {
            queryBuilder.andWhere('machineTransaction.priceType = :paymentType', { paymentType: query.paymentType });
        }
        if (query.machineName) {
            queryBuilder.andWhere('shopManagement.shopManagementName LIKE :machineName', { machineName: `%${query.machineName}%` });
        }
        if (query.programName) {
            queryBuilder.andWhere('programInfo.programName LIKE :programName', { programName: `%${query.programName}%` });
        }

        queryBuilder.innerJoin('machineTransaction.shopInfo', 'shopInfo');
        queryBuilder.innerJoin('machineTransaction.machineInfo', 'machineInfo');
        queryBuilder.innerJoin('machineTransaction.programInfo', 'programInfo');
        queryBuilder.innerJoin('machineTransaction.machineProgram', 'machineProgram');
        queryBuilder.innerJoin('machineTransaction.shopManagement', 'shopManagement');
        queryBuilder.orderBy('machineTransaction.createdAt', 'DESC');

        const paginationOptions: IPaginationOptions = {
            page: Number(page) || 1,
            limit: Number(limit) || 10,
        };
        return paginate<MachineTransactionEntity>(queryBuilder, paginationOptions);
    }

    async sumBranchIncome(query: ReportBranchIncomeDto) {
        const { startDate, endDate } = query;
        const queryBuilder = this.repo.createQueryBuilder('machineTransaction');
        
        const startOfDay = new Date(startDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        
        queryBuilder.select('SUM(machineTransaction.price) as totalPrice');
        queryBuilder.where('machineTransaction.deletedAt IS NULL');

        if (query.branchId) {
            const branchId = IdEncoderService.decode(query.branchId);
            queryBuilder.andWhere('machineTransaction.shopInfoId = :branchId', { branchId: branchId });
        }
        if (query.paymentType) {
            queryBuilder.andWhere('machineTransaction.priceType = :paymentType', { paymentType: query.paymentType });
        }
        if (query.machineName) {
            queryBuilder.andWhere('shopManagement.shopManagementName LIKE :machineName', { machineName: `%${query.machineName}%` });
        }
        if (query.programName) {
            queryBuilder.andWhere('programInfo.programName LIKE :programName', { programName: `%${query.programName}%` });
        }

        queryBuilder.andWhere('machineTransaction.createdAt >= :startDate', { startDate: startOfDay });
        queryBuilder.andWhere('machineTransaction.createdAt <= :endDate', { endDate: endOfDay });
        queryBuilder.innerJoin('machineTransaction.shopInfo', 'shopInfo');
        queryBuilder.innerJoin('machineTransaction.machineInfo', 'machineInfo');
        queryBuilder.innerJoin('machineTransaction.programInfo', 'programInfo');
        queryBuilder.innerJoin('machineTransaction.machineProgram', 'machineProgram');
        queryBuilder.innerJoin('machineTransaction.shopManagement', 'shopManagement');
        return queryBuilder.getRawOne();
    }

    async kbankPayment(query: ReportKbankPaymentDto) {
        const { startDate, endDate, branchId } = query;

        const firestore = this.firebaseService.getFirestore();
        const docRef = firestore.collection(KB_CALLBACK);

        const startOfDay = new Date(startDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);

        let docData: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[] = [];
        if(branchId){
            const branchIdDecode = IdEncoderService.decode(branchId);
            // const branchData = await this.repoShopManagement.findOne({ where: { shopInfoID: Number(branchIdDecode) } });
            const doc = await docRef.where('createdAt', '>=', startOfDay).where('createdAt', '<=', endOfDay).where('reference4', '==', `${branchIdDecode}`).orderBy('createdAt', 'asc').get();
            docData = doc.docs;
        }else{
            const doc = await docRef.where('createdAt', '>=', startOfDay).where('createdAt', '<=', endOfDay).orderBy('createdAt', 'asc').get();
            docData = doc.docs;
        }
        // console.log('branchData', branchData)
        const defaultDataBranch: {shopManagementKey: string, shopManagementName: string, shopName: string}[] = []
        const defaultDataProgram: {machineProgramKey: string, programName: string, machineType: string}[] = []
        return await Promise.all(docData.map(async (doc) => {
            let findDataBranch = defaultDataBranch.find(item => item.shopManagementKey === doc.data().reference3)
            let findDataProgram = defaultDataProgram.find(item => item.machineProgramKey === doc.data().reference1)
            if(!findDataBranch){
                const branchData = await this.repoShopManagement.createQueryBuilder('shopManagement')
                .select([
                    'shopManagement.shopManagementName', 
                    'shopInfo.shopName'
                ])
                .innerJoin('shopManagement.shopInfo', 'shopInfo')
                .where('shopManagement.shopManagementKey = :shopManagementKey', { shopManagementKey: doc.data().reference3 })
                .getOne();
                defaultDataBranch.push({shopManagementKey: doc.data().reference3, shopManagementName: branchData?.shopManagementName || '', shopName: branchData?.shopInfo.shopName || ''})
                findDataBranch = {shopManagementKey: doc.data().reference3, shopManagementName: branchData?.shopManagementName || '', shopName: branchData?.shopInfo.shopName || ''}
            }
            if(!findDataProgram){
                const programData = await this.repoMachineProgram.createQueryBuilder('machineProgram')
                .select([
                    'machineProgram.machineProgramKey',
                    'machineProgram.machineProgramPrice',
                    'machineInfo.machineType',
                    'programInfo.programName'
                ])
                .innerJoin('machineProgram.machineInfo', 'machineInfo')
                .innerJoin('machineProgram.programInfo', 'programInfo')
                .where('machineProgram.machineProgramKey = :machineProgramKey', { machineProgramKey: doc.data().reference1 })
                .getOne();
                defaultDataProgram.push({machineProgramKey: doc.data().reference1, programName: programData?.programInfo.programName || '', machineType: programData?.machineInfo.machineType || ''})
                findDataProgram = {machineProgramKey: doc.data().reference1, programName: programData?.programInfo.programName || '', machineType: programData?.machineInfo.machineType || ''}
            }
            return {
                ...doc.data(),
                shopManagementName: findDataBranch?.shopManagementName || '',
                shopName: findDataBranch?.shopName || '',
                createdAt: doc.data().createdAt.toDate(),
                programName: findDataProgram?.programName || '',
                machineType: findDataProgram?.machineType || '',
            };
        }));
    }

    async kbankPaymentSum(query: ReportKbankPaymentDto) {
        const { startDate, endDate, branchId } = query;
        const firestore = this.firebaseService.getFirestore();
        const docRef = firestore.collection(KB_CALLBACK);

        const startOfDay = new Date(startDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        let docData: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[] = [];
        if(branchId){
            const branchIdDecode = IdEncoderService.decode(branchId);
            const doc = await docRef.where('createdAt', '>=', startOfDay).where('createdAt', '<=', endOfDay).where('reference4', '==', `${branchIdDecode}`).orderBy('createdAt', 'asc').get();
            docData = doc.docs;
        }else{
            const doc = await docRef.where('createdAt', '>=', startOfDay).where('createdAt', '<=', endOfDay).orderBy('createdAt', 'asc').get();
            docData = doc.docs;
        }
        return {totalPrice: docData.reduce((acc, curr) => acc + curr.data().txnAmount, 0)};
    }
}
