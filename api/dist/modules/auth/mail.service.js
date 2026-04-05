"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = require("nodemailer");
let MailService = MailService_1 = class MailService {
    config;
    logger = new common_1.Logger(MailService_1.name);
    constructor(config) {
        this.config = config;
    }
    async sendPasswordResetEmail(to, token) {
        const host = this.config.get("mail.host");
        const port = Number(this.config.get("mail.port") ?? "587");
        const user = this.config.get("mail.user");
        const pass = this.config.get("mail.pass");
        const from = this.config.get("mail.from") ?? "no-reply@realstate.local";
        const resetUrlBase = this.config.get("mail.resetUrl") ??
            this.config.get("web.url") ??
            "http://localhost:3000/reset-password";
        if (!host || !user || !pass) {
            this.logger.warn(`Mail provider is not fully configured. Password reset email skipped for ${to}`);
            return;
        }
        const transporter = nodemailer.createTransport({
            host,
            port,
            secure: port === 465,
            auth: {
                user,
                pass,
            },
        });
        const resetUrl = `${resetUrlBase}?token=${encodeURIComponent(token)}`;
        await transporter.sendMail({
            from,
            to,
            subject: "Recuperacao de senha",
            text: `Voce solicitou a recuperacao de senha. Use este token: ${token}\n\nOu acesse: ${resetUrl}\n\nSe nao foi voce, ignore este email.`,
            html: `<p>Voce solicitou a recuperacao de senha.</p><p>Token: <strong>${token}</strong></p><p><a href="${resetUrl}">Redefinir senha</a></p><p>Se nao foi voce, ignore este email.</p>`,
        });
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map