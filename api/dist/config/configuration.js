"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    database: {
        url: process.env.DATABASE_URL,
    },
    jwt: {
        secret: process.env.JWT_SECRET ?? "dev_secret_change_me",
        expiresIn: process.env.JWT_EXPIRES_IN ?? "1d",
    },
    sicoob: {
        baseUrl: process.env.SICOOB_BASE_URL,
        token: process.env.SICOOB_TOKEN,
    },
});
//# sourceMappingURL=configuration.js.map