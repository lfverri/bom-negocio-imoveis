import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../prisma/prisma.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  private sanitizeCpf(identifier: string) {
    const digits = identifier.replace(/\D/g, "");
    return digits.length ? digits : null;
  }

  private sanitizeUser(user: {
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

  async validateUser(identifier: string, password: string) {
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

    if (!user) return null;
    if (!user.isActive) return null;

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return null;

    return user;
  }

  async login(identifier: string, password: string) {
    const user = await this.validateUser(identifier, password);
    if (!user) throw new UnauthorizedException("Invalid credentials");

    const accessToken = await this.jwt.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return { accessToken, user: this.sanitizeUser(user) };
  }

  async me(userId?: string) {
    if (!userId) throw new UnauthorizedException("Invalid token");

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException("Invalid token");
    if (!user.isActive) throw new UnauthorizedException("Inactive user");

    return this.sanitizeUser(user);
  }
}
