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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../prisma/prisma.service");
const bcrypt = require("bcrypt");
const crypto_1 = require("crypto");
const mail_service_1 = require("./mail.service");
let AuthService = class AuthService {
    jwt;
    prisma;
    mail;
    constructor(jwt, prisma, mail) {
        this.jwt = jwt;
        this.prisma = prisma;
        this.mail = mail;
    }
    sanitizeCpf(identifier) {
        const digits = identifier.replace(/\D/g, "");
        return digits.length ? digits : null;
    }
    sanitizeUser(user) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            cpf: user.cpf,
            role: user.role,
            avatarUrl: user.avatarUrl,
            phone: user.phone,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
    async validateUser(identifier, password) {
        const cpf = this.sanitizeCpf(identifier);
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    {
                        email: {
                            equals: identifier,
                            mode: "insensitive",
                        },
                    },
                    ...(cpf
                        ? [
                            {
                                cpf: {
                                    equals: cpf,
                                },
                            },
                        ]
                        : []),
                ],
            },
        });
        if (!user)
            return null;
        if (!user.isActive)
            return null;
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok)
            return null;
        return user;
    }
    async login(identifier, password) {
        const user = await this.validateUser(identifier, password);
        if (!user)
            throw new common_1.UnauthorizedException("Invalid credentials");
        const accessToken = await this.jwt.signAsync({
            sub: user.id,
            email: user.email,
            role: user.role,
        });
        return { accessToken, user: this.sanitizeUser(user) };
    }
    async register(dto) {
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const cpf = dto.cpf ? dto.cpf.replace(/\D/g, "") : undefined;
        try {
            const user = await this.prisma.user.create({
                data: {
                    name: dto.name,
                    email: dto.email,
                    cpf: cpf || undefined,
                    phone: dto.phone,
                    avatarUrl: dto.avatarUrl,
                    role: "AGENT",
                    passwordHash,
                },
            });
            const accessToken = await this.jwt.signAsync({
                sub: user.id,
                email: user.email,
                role: user.role,
            });
            return { accessToken, user: this.sanitizeUser(user) };
        }
        catch (error) {
            if (error?.code === "P2002") {
                throw new common_1.ConflictException("Email or CPF already in use");
            }
            throw error;
        }
    }
    async forgotPassword(email) {
        const user = await this.prisma.user.findFirst({
            where: {
                email: {
                    equals: email,
                    mode: "insensitive",
                },
                isActive: true,
            },
        });
        if (!user) {
            return {
                message: "If the account exists, a password reset message has been sent",
            };
        }
        const token = (0, crypto_1.randomBytes)(32).toString("hex");
        const tokenHash = (0, crypto_1.createHash)("sha256").update(token).digest("hex");
        const expiresAt = new Date(Date.now() + 1000 * 60 * 30);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                passwordResetTokenHash: tokenHash,
                passwordResetTokenExpiresAt: expiresAt,
            },
        });
        await this.mail.sendPasswordResetEmail(user.email, token);
        return {
            message: "If the account exists, a password reset message has been sent",
        };
    }
    async resetPassword(token, newPassword) {
        const tokenHash = (0, crypto_1.createHash)("sha256").update(token).digest("hex");
        const user = await this.prisma.user.findFirst({
            where: {
                isActive: true,
                passwordResetTokenHash: tokenHash,
                passwordResetTokenExpiresAt: {
                    gt: new Date(),
                },
            },
        });
        if (!user) {
            throw new common_1.BadRequestException("Invalid or expired reset token");
        }
        const passwordHash = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                passwordHash,
                passwordResetTokenHash: null,
                passwordResetTokenExpiresAt: null,
            },
        });
        return { message: "Password updated successfully" };
    }
    async me(userId) {
        if (!userId)
            throw new common_1.UnauthorizedException("Invalid token");
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.UnauthorizedException("Invalid token");
        if (!user.isActive)
            throw new common_1.UnauthorizedException("Inactive user");
        return this.sanitizeUser(user);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        prisma_service_1.PrismaService,
        mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map