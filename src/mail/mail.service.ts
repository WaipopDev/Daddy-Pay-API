import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

interface SendMailOptions {
    to: string;
    subject: string;
    html: string;
    text: string;
    logPreview: string;
}

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);

    constructor(private readonly config: ConfigService) { }

    private isLogOnlyMode(): boolean {
        return this.config.get<string>('SMTP_LOG_ONLY') === 'true';
    }

    private useOAuth2(): boolean {
        const clientId = this.config.get<string>('SMTP_OAUTH_CLIENT_ID');
        const clientSecret = this.config.get<string>('SMTP_OAUTH_CLIENT_SECRET');
        const refreshToken = this.config.get<string>('SMTP_OAUTH_REFRESH_TOKEN');
        const user = this.config.get<string>('SMTP_USER');
        return Boolean(clientId && clientSecret && refreshToken && user);
    }

    private getFromAddress(): string | undefined {
        return this.config.get<string>('SMTP_FROM') || this.config.get<string>('SMTP_USER');
    }

    private createTransporter(): Transporter {
        const host = this.config.get<string>('SMTP_HOST') || 'smtp.office365.com';
        const port = Number(this.config.get<string>('SMTP_PORT') || 587);
        const secure = this.config.get<string>('SMTP_SECURE') === 'true' || port === 465;
        const user = this.config.get<string>('SMTP_USER');

        if (this.useOAuth2()) {
            const tenantId = this.config.get<string>('SMTP_OAUTH_TENANT_ID') || 'common';
            return nodemailer.createTransport({
                host,
                port,
                secure,
                auth: {
                    type: 'OAuth2',
                    user,
                    clientId: this.config.get<string>('SMTP_OAUTH_CLIENT_ID'),
                    clientSecret: this.config.get<string>('SMTP_OAUTH_CLIENT_SECRET'),
                    refreshToken: this.config.get<string>('SMTP_OAUTH_REFRESH_TOKEN'),
                    accessUrl: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
                },
            });
        }

        const pass = this.config.get<string>('SMTP_PASS');
        return nodemailer.createTransport({
            host,
            port,
            secure,
            auth: { user, pass },
        });
    }

    private isMailConfigured(): boolean {
        const user = this.config.get<string>('SMTP_USER');
        if (!user) {
            return false;
        }
        if (this.useOAuth2()) {
            return true;
        }
        return Boolean(this.config.get<string>('SMTP_PASS'));
    }

    private async deliverMail(options: SendMailOptions): Promise<void> {
        const from = this.getFromAddress();

        if (this.isLogOnlyMode()) {
            this.logger.warn(
                `SMTP_LOG_ONLY=true. Email skipped for ${options.to}. Subject="${options.subject}"`,
            );
            this.logger.log(options.logPreview);
            return;
        }

        if (!this.isMailConfigured() || !from) {
            this.logger.warn(
                `SMTP not configured. Email for ${options.to}: ${options.logPreview}`,
            );
            return;
        }

        const transporter = this.createTransporter();
        await transporter.sendMail({
            from,
            to: options.to,
            subject: options.subject,
            html: options.html,
            text: options.text,
        });
    }

    async sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
        const subject = 'Daddy Pay — Reset your password';
        const html = `
            <p>You requested a password reset.</p>
            <p><a href="${resetUrl}">Reset your password</a></p>
            <p>This link expires in 1 hour. If you did not request this, ignore this email.</p>
        `;
        const text = `Reset your password: ${resetUrl}\n\nThis link expires in 1 hour.`;

        await this.deliverMail({
            to,
            subject,
            html,
            text,
            logPreview: `Password reset preview: ${text}`,
        });
    }

    async sendSubscriptionExpiryReminder(
        to: string,
        shopName: string,
        shopCode: string,
        expirationDate: string,
        daysBefore: number,
    ): Promise<void> {
        const subject = `Daddy Pay — Subscription expiring in ${daysBefore} day(s)`;
        const html = `
            <p>Shop subscription reminder</p>
            <p><strong>Shop:</strong> ${shopName} (${shopCode})</p>
            <p><strong>Expiration date:</strong> ${expirationDate}</p>
            <p>Your subscription will expire in <strong>${daysBefore}</strong> day(s). Please renew before the expiration date.</p>
        `;
        const text = `Shop: ${shopName} (${shopCode})\nExpiration: ${expirationDate}\nExpires in ${daysBefore} day(s). Please renew.`;

        await this.deliverMail({
            to,
            subject,
            html,
            text,
            logPreview: `Subscription reminder preview: ${text}`,
        });
    }
}
