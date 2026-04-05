import { Injectable, NotFoundException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersRepository } from "./users.repository";

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  private toPublicUser(user: {
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
  }) {
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

  async list() {
    const users = await this.usersRepo.findMany({
      orderBy: { createdAt: "desc" },
    });
    return users.map((u) => this.toPublicUser(u));
  }

  async getById(id: string) {
    const user = await this.usersRepo.findById(id);
    if (!user) throw new NotFoundException("User not found");
    return this.toPublicUser(user);
  }

  async create(dto: CreateUserDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const cpf = dto.cpf ? dto.cpf.replace(/\D/g, "") : undefined;

    const user = await this.usersRepo.create({
      name: dto.name,
      email: dto.email,
      cpf: cpf || undefined,
      phone: dto.phone,
      avatarUrl: dto.avatarUrl,
      role: dto.role,
      passwordHash,
    });

    return this.toPublicUser(user);
  }

  async update(id: string, dto: UpdateUserDto) {
    const cpf = dto.cpf ? dto.cpf.replace(/\D/g, "") : undefined;
    const passwordHash = dto.password
      ? await bcrypt.hash(dto.password, 10)
      : undefined;

    const user = await this.usersRepo.update(id, {
      name: dto.name,
      email: dto.email,
      cpf: cpf === undefined ? undefined : cpf || null,
      phone: dto.phone,
      avatarUrl: dto.avatarUrl,
      role: dto.role,
      isActive: dto.isActive,
      passwordHash,
    });

    return this.toPublicUser(user);
  }

  async remove(id: string) {
    // Soft delete to avoid FK issues
    return this.update(id, { isActive: false });
  }
}
