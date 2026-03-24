export declare const USER_ROLES: readonly ["ADMIN", "MANAGER", "AGENT", "VIEWER"];
export type UserRole = (typeof USER_ROLES)[number];
export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
    cpf?: string;
    phone?: string;
    avatarUrl?: string;
    role?: UserRole;
}
