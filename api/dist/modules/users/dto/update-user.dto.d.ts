import { type UserRole } from "./create-user.dto";
export declare class UpdateUserDto {
    name?: string;
    email?: string;
    cpf?: string;
    phone?: string;
    avatarUrl?: string;
    role?: UserRole;
    isActive?: boolean;
    password?: string;
}
