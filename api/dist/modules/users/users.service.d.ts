import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersRepository } from "./users.repository";
export declare class UsersService {
    private readonly usersRepo;
    constructor(usersRepo: UsersRepository);
    private toPublicUser;
    list(): Promise<{
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
    }[]>;
    getById(id: string): Promise<{
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
    create(dto: CreateUserDto): Promise<{
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
    update(id: string, dto: UpdateUserDto): Promise<{
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
    remove(id: string): Promise<{
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
