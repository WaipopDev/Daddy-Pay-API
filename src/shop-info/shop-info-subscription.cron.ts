import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import moment from 'moment-timezone';
import { MailService } from 'src/mail/mail.service';
import { ShopInfoRepository } from 'src/repositories/ShopInfo.repository';

@Injectable()
export class ShopInfoSubscriptionCronService {
    private readonly logger = new Logger(ShopInfoSubscriptionCronService.name);

    constructor(
        private readonly shopInfoRepository: ShopInfoRepository,
        private readonly mailService: MailService,
    ) {}

    @Cron('0 0 * * *', { timeZone: 'Asia/Bangkok' })
    async syncSubscriptionStatusByDate(): Promise<void> {
        const today = moment.tz('Asia/Bangkok').startOf('day');
        const shops = await this.shopInfoRepository.findShopsForSubscriptionCron();

        let activated = 0;
        let expired = 0;
        let skipped = 0;
        let emailsSent = 0;

        for (const shop of shops) {
            const registration = moment.tz(shop.subRegistrationDate, 'Asia/Bangkok').startOf('day');
            const expiration = moment.tz(shop.subExpirationDate, 'Asia/Bangkok').startOf('day');

            if (registration.isAfter(today) || expiration.isBefore(today)) {
                if (shop.subSubscriptionStatus !== 'expired') {
                    await this.shopInfoRepository.update(shop.id, {
                        subSubscriptionStatus: 'expired',
                        updatedAt: new Date(),
                    });
                    expired++;
                }
                continue;
            }

            if (shop.subSubscriptionStatus === 'active') {
                skipped++;
            } else {
                await this.shopInfoRepository.update(shop.id, {
                    subSubscriptionStatus: 'active',
                    updatedAt: new Date(),
                });
                activated++;
            }

            if (
                shop.subNotificationCycle != null &&
                shop.subNotificationCycle > 0 &&
                shop.subNotifyToEmail
            ) {
                const notifyDate = expiration.clone().subtract(shop.subNotificationCycle, 'days');
                if (today.isSame(notifyDate, 'day')) {
                    const recipients = this.parseEmails(shop.subNotifyToEmail);
                    const expirationLabel = expiration.format('YYYY-MM-DD');

                    for (const email of recipients) {
                        try {
                            await this.mailService.sendSubscriptionExpiryReminder(
                                email,
                                shop.shopName,
                                shop.shopCode,
                                expirationLabel,
                                shop.subNotificationCycle,
                            );
                            emailsSent++;
                        } catch (error) {
                            this.logger.error(
                                `Failed to send subscription reminder to ${email} (shop ${shop.id}): ${error?.message}`,
                            );
                        }
                    }
                }
            }
        }

        this.logger.log(
            `Cron subscription: checked=${shops.length}, activated=${activated}, expired=${expired}, skipped=${skipped}, emailsSent=${emailsSent}`,
        );
    }

    private parseEmails(raw: string): string[] {
        return raw.split(/[,;]/).map((email) => email.trim()).filter(Boolean);
    }
}
