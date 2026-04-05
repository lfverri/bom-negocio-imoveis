import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly config: ConfigService) {}

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const host = this.config.get<string>("mail.host");
    const port = Number(this.config.get<string>("mail.port") ?? "587");
    const user = this.config.get<string>("mail.user");
    const pass = this.config.get<string>("mail.pass");
    const from =
      this.config.get<string>("mail.from") ?? "no-reply@realstate.local";
    const resetUrlBase =
      this.config.get<string>("mail.resetUrl") ??
      this.config.get<string>("web.url") ??
      "http://localhost:3000/reset-password";

    if (!host || !user || !pass) {
      this.logger.warn(
        `Mail provider is not fully configured. Password reset email skipped for ${to}`,
      );
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
}
