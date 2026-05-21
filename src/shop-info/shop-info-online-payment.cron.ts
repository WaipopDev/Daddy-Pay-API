import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import moment from 'moment-timezone';
import { ShopInfoRepository } from 'src/repositories/ShopInfo.repository';

@Injectable()
export class ShopInfoOnlinePaymentCronService {
    private readonly logger = new Logger(ShopInfoOnlinePaymentCronService.name);

    constructor(private readonly shopInfoRepository: ShopInfoRepository) {}

    @Cron('0 0 * * *', { timeZone: 'Asia/Bangkok' })
    async syncOnlinePaymentStatusByDate(): Promise<void> {
        const today = moment.tz('Asia/Bangkok').startOf('day');
        const shops = await this.shopInfoRepository.findShopsWithOnlinePaymentDates();

        let enabled = 0;
        let disabled = 0;
        let skipped = 0;

        for (const shop of shops) {
            const activation = moment.tz(shop.onlineActivationDate, 'Asia/Bangkok').startOf('day');
            const close = moment.tz(shop.onlineCloseDate, 'Asia/Bangkok').startOf('day');

            if (activation.isAfter(today) || close.isBefore(today)) {
                if (shop.onlinePaymentStatus !== 'disable') {
                    await this.shopInfoRepository.update(shop.id, {
                        onlinePaymentStatus: 'disable',
                        updatedAt: new Date(),
                    });
                    disabled++;
                }
                continue;
            }

            if (shop.onlinePaymentStatus === 'enable') {
                skipped++;
                continue;
            }

            await this.shopInfoRepository.update(shop.id, {
                onlinePaymentStatus: 'enable',
                updatedAt: new Date(),
            });
            enabled++;
        }

        this.logger.log(
            `Cron online payment: checked=${shops.length}, enabled=${enabled}, disabled=${disabled}, skipped=${skipped}`,
        );
    }
}
