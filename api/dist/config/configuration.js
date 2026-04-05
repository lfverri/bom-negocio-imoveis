"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    database: {
        url: process.env.DATABASE_URL,
    },
    web: {
        url: process.env.WEB_URL ?? "http://localhost:3000",
    },
    jwt: {
        secret: process.env.JWT_SECRET ?? "dev_secret_change_me",
        expiresIn: process.env.JWT_EXPIRES_IN ?? "4h",
    },
    mail: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT ?? "587",
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
        from: process.env.SMTP_FROM ?? "no-reply@realstate.local",
        resetUrl: process.env.PASSWORD_RESET_URL ?? "http://localhost:3000/reset-password",
    },
    sicoob: {
        baseUrl: process.env.SICOOB_BASE_URL,
        token: process.env.SICOOB_TOKEN,
    },
});
//# sourceMappingURL=configuration.js.map