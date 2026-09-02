import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, FindOptionsWhere, In } from 'typeorm';
import { LangMainEntity } from 'src/models/entities/LangMain.entity';
import { LangListEntity } from 'src/models/entities/LangList.entity';
import { ResponseLanguageDto } from 'src/language/dto/language.dto';
import { MachineTransactionEntity } from 'src/models/entities/MachineTransaction.entity';
import { IPaginationOptions, paginate, paginateRaw } from 'nestjs-typeorm-paginate';
import { ReportBranchIncomeDto, ReportKbankPaymentDto } from 'src/report/dto/report.dto';
import { FirebaseService } from 'src/firebase/firebase.service';
import { KB_CALLBACK } from 'src/constants/collection-firebase';
import { IdEncoderService } from 'src/utility/id-encoder.service';
import { ShopManagementEntity } from 'src/models/entities/ShopManagement.entity';
import { ShopInfoEntity } from 'src/models/entities/ShopInfo.entity';
import { ProgramInfoEntity } from 'src/models/entities/ProgramInfo.entity';
import { MachineProgramEntity } from 'src/models/entities/MachineProgram.entity';
import moment from 'moment';

type SqlParam =
    | string
    | number
    | boolean
    | Date
    | null
    | undefined
    | number[]
    | string[]
    | boolean[];

interface BranchIncomeRawRow {
    id: number;
    shopInfoId: number;
    shopManagementId: number;
    priceType: string;
    price: string | number;
    createdAt: Date | string;
    transactionId: string | null;
    transactionIot: string | null;
    shopName: string;
    machineType: string;
    programName: string;
    shopManagementName: string;
    deletedAt: Date | string | null;
}

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

    async findBranchIncome(query: ReportBranchIncomeDto, permissions: number[]) {
        const { startDate, endDate, page, limit } = query;
        const queryBuilder = this.repo.createQueryBuilder('machineTransaction');

        // Validate and parse dates
        if (!startDate || !endDate) {
            throw new Error('startDate and endDate are required');
        }

        const startOfDay = moment.tz(startDate, 'Asia/Bangkok').startOf('day').toDate();
        const endOfDay = moment.tz(endDate, 'Asia/Bangkok').endOf('day').toDate();

        // Check if dates are valid
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
        if(permissions.length > 0){
            queryBuilder.andWhere('machineTransaction.shopInfoId IN (:...permissions)', { permissions: permissions });
        }

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

    async findBranchIncomeRaw(query: ReportBranchIncomeDto, permissions: number[]) {
        const { startDate, endDate, page, limit } = query;

        if (!startDate || !endDate) {
            throw new Error('startDate and endDate are required');
        }

        const startOfDay = moment.tz(startDate, 'Asia/Bangkok').startOf('day').toDate();
        const endOfDay = moment.tz(endDate, 'Asia/Bangkok').endOf('day').toDate();

        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 10;
        const offset = (pageNum - 1) * limitNum;

        // Build WHERE clauses with Postgres placeholders ($1, $2, ...)
        const where: string[] = [];
        const params: SqlParam[] = [];
        const pushParam = (v: SqlParam) => {
            params.push(v);
            return `$${params.length}`;
        };

        where.push(`mt.deleted_at IS NULL`);
        where.push(`mt.created_at >= ${pushParam(startOfDay)}`);
        where.push(`mt.created_at <= ${pushParam(endOfDay)}`);

        if (permissions.length > 0) {
            where.push(`mt.shop_info_id = ANY(${pushParam(permissions)})`);
        }

        if (query.branchId) {
            const branchId = IdEncoderService.decode(query.branchId);
            where.push(`mt.shop_info_id = ${pushParam(branchId)}`);
        }

        if (query.paymentType) {
            where.push(`mt.price_type = ${pushParam(query.paymentType)}`);
        }

        if (query.machineName) {
            // search both normal name and the renamed (soft-delete workaround) name
            const like1 = `%${query.machineName}%`;
            const like2 = `%${query.machineName}_deleted_%`;
            where.push(`(sm.shop_management_name LIKE ${pushParam(like1)} OR sm.shop_management_name LIKE ${pushParam(like2)})`);
        }

        if (query.programName) {
            where.push(`pi.program_name LIKE ${pushParam(`%${query.programName}%`)}`);
        }

        const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

        // IMPORTANT:
        // - join shop_management WITHOUT filtering sm.deleted_at to include soft-deleted
        // - keep other joins filtering deleted_at like before
        const baseFrom = `
                FROM machine_transaction mt
                INNER JOIN shop_info si ON si.id = mt.shop_info_id AND si.deleted_at IS NULL
                INNER JOIN machine_info mi ON mi.id = mt.machine_info_id AND mi.deleted_at IS NULL
                INNER JOIN program_info pi ON pi.id = mt.program_info_id AND pi.deleted_at IS NULL
                INNER JOIN machine_program mp ON mp.id = mt.machine_program_id AND mp.deleted_at IS NULL
                INNER JOIN shop_management sm ON sm.id = mt.shop_management_id
                ${whereSql}
                        `.trim();

        const countSql = `
                SELECT COUNT(*)::int AS "count"
                ${baseFrom}
                        `.trim();

        const countRows = (await this.db.query(countSql, params)) as Array<{ count: number }>;
        const totalItems = Number(countRows?.[0]?.count ?? 0);

        const dataSql = `
                SELECT
                mt.id AS "id",
                mt.shop_info_id AS "shopInfoId",
                mt.shop_management_id AS "shopManagementId",
                mt.price_type AS "priceType",
                CASE WHEN mt.price_type = 'force' THEN 0 ELSE mt.price END AS "price",
                mt.created_at AS "createdAt",
                mt.transaction_id AS "transactionId",
                mt.transaction_iot AS "transactionIot",
                si.shop_name AS "shopName",
                mi.machine_type AS "machineType",
                pi.program_name AS "programName",
                sm.shop_management_name AS "shopManagementName",
                sm.deleted_at AS "deletedAt"
                ${baseFrom}
                ORDER BY mt.created_at DESC
                LIMIT ${limitNum} OFFSET ${offset}
                        `.trim();

        const rows = (await this.db.query(dataSql, params)) as BranchIncomeRawRow[];

        const items = rows.map((r) => ({
            id: r.id,
            shopInfoId: r.shopInfoId,
            shopManagementId: r.shopManagementId,
            priceType: r.priceType,
            price: typeof r.price === 'string' ? parseFloat(r.price) : r.price,
            createdAt: typeof r.createdAt === 'string' ? new Date(r.createdAt) : r.createdAt,
            transactionId: r.transactionId,
            transactionIot: r.transactionIot,
            shopInfo: { shopName: r.shopName },
            machineInfo: { machineType: r.machineType },
            programInfo: { programName: r.programName },
            shopManagement: { shopManagementName: r.shopManagementName, deletedAt: r.deletedAt },
        }));

        return {
            items,
            meta: {
                totalItems,
                itemCount: items.length,
                itemsPerPage: limitNum,
                totalPages: Math.ceil(totalItems / limitNum),
                currentPage: pageNum,
            },
        };
    }

    async sumBranchIncome(query: ReportBranchIncomeDto, permissions: number[]) {
        const { startDate, endDate } = query;
        const queryBuilder = this.repo.createQueryBuilder('machineTransaction');
        
        // Validate and parse dates
        if (!startDate || !endDate) {
            throw new Error('startDate and endDate are required');
        }

        const startOfDay = moment.tz(startDate, 'Asia/Bangkok').startOf('day').toDate();
        const endOfDay = moment.tz(endDate, 'Asia/Bangkok').endOf('day').toDate();

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
        if(permissions.length > 0){
            queryBuilder.andWhere('machineTransaction.shopInfoId IN (:...permissions)', { permissions: permissions });
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

    async sumBranchIncomeRaw(query: ReportBranchIncomeDto, permissions: number[]) {
        const { startDate, endDate } = query;

        if (!startDate || !endDate) {
            throw new Error('startDate and endDate are required');
        }

        const startOfDay = moment.tz(startDate, 'Asia/Bangkok').startOf('day').toDate();
        const endOfDay = moment.tz(endDate, 'Asia/Bangkok').endOf('day').toDate();

        // Build WHERE clauses with Postgres placeholders ($1, $2, ...)
        const where: string[] = [];
        const params: SqlParam[] = [];
        const pushParam = (v: SqlParam) => {
            params.push(v);
            return `$${params.length}`;
        };

        where.push(`mt.deleted_at IS NULL`);
        where.push(`mt.created_at >= ${pushParam(startOfDay)}`);
        where.push(`mt.created_at <= ${pushParam(endOfDay)}`);

        if (permissions.length > 0) {
            where.push(`mt.shop_info_id = ANY(${pushParam(permissions)})`);
        }

        if (query.branchId) {
            const branchId = IdEncoderService.decode(query.branchId);
            where.push(`mt.shop_info_id = ${pushParam(branchId)}`);
        }

        if (query.paymentType) {
            where.push(`mt.price_type = ${pushParam(query.paymentType)}`);
        }

        if (query.machineName) {
            // search both normal name and the renamed (soft-delete workaround) name
            const like1 = `%${query.machineName}%`;
            const like2 = `%${query.machineName}_deleted_%`;
            where.push(`(sm.shop_management_name LIKE ${pushParam(like1)} OR sm.shop_management_name LIKE ${pushParam(like2)})`);
        }

        if (query.programName) {
            where.push(`pi.program_name LIKE ${pushParam(`%${query.programName}%`)}`);
        }

        const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

        // IMPORTANT:
        // - join shop_management WITHOUT filtering sm.deleted_at to include soft-deleted
        // - keep other joins filtering deleted_at like before
        const sql = `
            SELECT SUM(
                CASE WHEN mt.price_type = 'force' THEN 0 ELSE mt.price END
            ) AS "totalPrice"
            FROM machine_transaction mt
            INNER JOIN shop_info si ON si.id = mt.shop_info_id AND si.deleted_at IS NULL
            INNER JOIN machine_info mi ON mi.id = mt.machine_info_id AND mi.deleted_at IS NULL
            INNER JOIN program_info pi ON pi.id = mt.program_info_id AND pi.deleted_at IS NULL
            INNER JOIN machine_program mp ON mp.id = mt.machine_program_id AND mp.deleted_at IS NULL
            INNER JOIN shop_management sm ON sm.id = mt.shop_management_id
            ${whereSql}
            `.trim();

        const result = await this.db.query(sql, params);
        const totalPrice = result[0]?.totalPrice ? parseFloat(result[0].totalPrice) : 0;
        return { totalPrice };
    }

    async kbankPayment(query: ReportKbankPaymentDto, permissions: number[]) {
        const { startDate, endDate, branchId } = query;

        // Validate and parse dates
        if (!startDate || !endDate) {
            throw new Error('startDate and endDate are required');
        }

        const startOfDay = moment.tz(startDate, 'Asia/Bangkok').startOf('day').toDate();
        const endOfDay = moment.tz(endDate, 'Asia/Bangkok').endOf('day').toDate();

        const firestore = this.firebaseService.getFirestore();
        const docRef = firestore.collection(KB_CALLBACK);

        let docData: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[] = [];
        if(branchId){
            const branchIdDecode = IdEncoderService.decode(branchId);
                const doc = await docRef.where('createdAt', '>=', startOfDay).where('createdAt', '<=', endOfDay).where('reference4', '==', `${branchIdDecode}`).orderBy('createdAt', 'desc').get();
                docData = doc.docs;
          
        }else{
                const doc = await docRef.where('createdAt', '>=', startOfDay).where('createdAt', '<=', endOfDay).orderBy('createdAt', 'desc').get();
                docData = doc.docs;
        }
        // console.log('branchData', branchData)
        const defaultDataBranch: {shopManagementKey: string, shopManagementName: string, shopName: string}[] = []
        const defaultDataProgram: {machineProgramKey: string, programName: string, machineType: string}[] = []
  
        const data = await Promise.all(docData.map(async (doc) => {
            let findDataBranch = defaultDataBranch.find(item => item.shopManagementKey === doc.data().reference3)
            let findDataProgram = defaultDataProgram.find(item => item.machineProgramKey === doc.data().reference1)
            if(!findDataBranch){
                const branchData = await this.repoShopManagement.createQueryBuilder('shopManagement')
                .select([
                    'shopManagement.shopManagementName', 
                    'shopInfo.shopName',
                    'shopInfo.id'
                ])
                .innerJoin('shopManagement.shopInfo', 'shopInfo')
                .where('shopManagement.shopManagementKey = :shopManagementKey', { shopManagementKey: doc.data().reference3 })
                .withDeleted()
                .getOne();
                if(permissions.length > 0){
                    const isPermission = permissions.find(item => item === branchData?.shopInfo.id)
                    if(!isPermission){
                        return null;
                    }
                }
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
                .withDeleted()
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
        return data.filter(item => item !== null);
    }

    async kbankPaymentSum(query: ReportKbankPaymentDto, permissions: number[]) {
        const { startDate, endDate, branchId } = query;
        
        // Validate and parse dates
        if (!startDate || !endDate) {
            throw new Error('startDate and endDate are required');
        }

        const startOfDay = moment.tz(startDate, 'Asia/Bangkok').startOf('day').toDate();
        const endOfDay = moment.tz(endDate, 'Asia/Bangkok').endOf('day').toDate();


        const firestore = this.firebaseService.getFirestore();
        const docRef = firestore.collection(KB_CALLBACK);
        let docData: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[] = [];
        if(branchId){
            const branchIdDecode = IdEncoderService.decode(branchId);
            const doc = await docRef.where('createdAt', '>=', startOfDay).where('createdAt', '<=', endOfDay).where('reference4', '==', `${branchIdDecode}`).orderBy('createdAt', 'desc').get();
            docData = doc.docs;
            
        }else{
            const doc = await docRef.where('createdAt', '>=', startOfDay).where('createdAt', '<=', endOfDay).orderBy('createdAt', 'desc').get();
            docData = doc.docs;
        }
        const defaultDataBranch: {shopManagementKey: string}[] = []
        const data = await Promise.all(docData.map(async (doc) => {
            let findDataBranch = defaultDataBranch.find(item => item.shopManagementKey === doc.data().reference3)
            if (!findDataBranch && permissions.length > 0) {
                const branchData = await this.repoShopManagement.createQueryBuilder('shopManagement')
                    .select([
                        'shopManagement.shopManagementName',
                        'shopInfo.shopName',
                        'shopInfo.id'
                    ])
                    .innerJoin('shopManagement.shopInfo', 'shopInfo')
                    .where('shopManagement.shopManagementKey = :shopManagementKey', { shopManagementKey: doc.data().reference3 })
                    .andWhere('shopInfo.id IN (:...permissions)', { permissions: permissions })
                    .withDeleted()
                    .getOne();
                if(!branchData){
                    return null;
                }
                defaultDataBranch.push({ shopManagementKey: doc.data().reference3})
                
            }
            return doc.data().txnAmount
        }));
        const dataFilter = data.filter(item => item !== null);

        return {totalPrice: dataFilter.reduce((acc, curr) => acc + curr, 0)};
    }
}
