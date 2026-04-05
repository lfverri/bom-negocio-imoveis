import { BaseRepository } from "../../common/base.repository";
import { PrismaService } from "../../prisma/prisma.service";
export type User = {
    id: string;
    name: string;
    email: string;
    cpf: string | null;
    role: string;
    avatarUrl: string | null;
    phone: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
};
export declare class UsersRepository extends BaseRepository<User> {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByIdentifier(identifier: string): import("@prisma/client").Prisma.Prisma__UserClient<{
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
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
