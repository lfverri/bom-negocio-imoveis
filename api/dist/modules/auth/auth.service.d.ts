import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../prisma/prisma.service";
import { RegisterDto } from "./dto/register.dto";
import { MailService } from "./mail.service";
export declare class AuthService {
    private readonly jwt;
    private readonly prisma;
    private readonly mail;
    constructor(jwt: JwtService, prisma: PrismaService, mail: MailService);
    private sanitizeCpf;
    private sanitizeUser;
    validateUser(identifier: string, password: string): Promise<{
        name: string;
        email: string;
        cpf: string | null;
        phone: string | null;
        avatarUrl: string | null;
        id: string;
        passwordHash: string;
        passwordResetTokenHash: string | null;
        passwordResetTokenExpiresAt: Date | null;
        role: import("@prisma/client").$Enums.UserRole;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    login(identifier: string, password: string): Promise<{
        accessToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            cpf: string | null;
            role: any;
            avatarUrl: string | null;
            phone: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            cpf: string | null;
            role: any;
            avatarUrl: string | null;
            phone: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
    me(userId?: string): Promise<{
        id: string;
        name: string;
        email: string;
        cpf: string | null;
        role: any;
        avatarUrl: string | null;
        phone: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
