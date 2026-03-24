import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../prisma/prisma.service";
export declare class AuthService {
    private readonly jwt;
    private readonly prisma;
    constructor(jwt: JwtService, prisma: PrismaService);
    private sanitizeCpf;
    private sanitizeUser;
    validateUser(identifier: string, password: string): Promise<{
        id: string;
        name: string;
        email: string;
        cpf: string | null;
        passwordHash: string;
        role: import(".prisma/client").$Enums.UserRole;
        avatarUrl: string | null;
        phone: string | null;
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
