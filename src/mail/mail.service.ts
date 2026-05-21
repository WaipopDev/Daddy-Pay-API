import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);

    constructor(private readonly config: ConfigService) { }

    async sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
        const host = this.config.get<string>('SMTP_HOST');
        const port = Number(this.config.get<string>('SMTP_PORT') || 587);
        const user = this.config.get<string>('SMTP_USER');
        const pass = this.config.get<string>('SMTP_PASS');
        const from = this.config.get<string>('SMTP_FROM') || user;

        if (!host || !user || !pass) {
            this.logger.warn(
                `SMTP not configured. Password reset link for ${to}: ${resetUrl}`,
            );
            return;
        }

        const transporter = nodemailer.createTransport({
            host,
            port,
            secure: port === 465,
            auth: { user, pass },
        });

        await transporter.sendMail({
            from,
            to,
            subject: 'Daddy Pay — Reset your password',
            html: `
                <p>You requested a password reset.</p>
                <p><a href="${resetUrl}">Reset your password</a></p>
                <p>This link expires in 1 hour. If you did not request this, ignore this email.</p>
            `,
            text: `Reset your password: ${resetUrl}\n\nThis link expires in 1 hour.`,
        });
    }

    async sendSubscriptionExpiryReminder(
        to: string,
        shopName: string,
        shopCode: string,
        expirationDate: string,
        daysBefore: number,
    ): Promise<void> {
        const host = this.config.get<string>('SMTP_HOST');
        const port = Number(this.config.get<string>('SMTP_PORT') || 587);
        const user = this.config.get<string>('SMTP_USER');
        const pass = this.config.get<string>('SMTP_PASS');
        const from = this.config.get<string>('SMTP_FROM') || user;

        const subject = `Daddy Pay — Subscription expiring in ${daysBefore} day(s)`;
        const html = `
            <p>Shop subscription reminder</p>
            <p><strong>Shop:</strong> ${shopName} (${shopCode})</p>
            <p><strong>Expiration date:</strong> ${expirationDate}</p>
            <p>Your subscription will expire in <strong>${daysBefore}</strong> day(s). Please renew before the expiration date.</p>
        `;
        const text = `Shop: ${shopName} (${shopCode})\nExpiration: ${expirationDate}\nExpires in ${daysBefore} day(s). Please renew.`;

        if (!host || !user || !pass) {
            this.logger.warn(
                `SMTP not configured. Subscription reminder for ${to}: ${text}`,
            );
            return;
        }

        const transporter = nodemailer.createTransport({
            host,
            port,
            secure: port === 465,
            auth: { user, pass },
        });

        await transporter.sendMail({ from, to, subject, html, text });
    }
}
