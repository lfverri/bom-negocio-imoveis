import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { createHash, randomBytes } from "crypto";
import { RegisterDto } from "./dto/register.dto";
import { MailService } from "./mail.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
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

  async register(dto: RegisterDto) {
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
    } catch (error) {
      if ((error as { code?: string })?.code === "P2002") {
        throw new ConflictException("Email or CPF already in use");
      }

      throw error;
    }
  }

  async forgotPassword(email: string) {
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
        message:
          "If the account exists, a password reset message has been sent",
      };
    }

    const token = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(token).digest("hex");
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

  async resetPassword(token: string, newPassword: string) {
    const tokenHash = createHash("sha256").update(token).digest("hex");

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
      throw new BadRequestException("Invalid or expired reset token");
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

  async me(userId?: string) {
    if (!userId) throw new UnauthorizedException("Invalid token");

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException("Invalid token");
    if (!user.isActive) throw new UnauthorizedException("Inactive user");

    return this.sanitizeUser(user);
  }
}
