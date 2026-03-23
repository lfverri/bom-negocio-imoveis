import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

type UserLike = {
  id: string;
  email: string;
  passwordHash: string;
  role: string;
};

@Injectable()
export class AuthService {
  // Stub: substitua por UsersRepository/Prisma depois
  private readonly users: UserLike[] = [
    {
      id: "dev-user",
      email: "admin@example.com",
      passwordHash: bcrypt.hashSync("admin123", 10),
      role: "admin",
    },
  ];

  constructor(private readonly jwt: JwtService) {}

  async validateUser(email: string, password: string) {
    const user = this.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
    if (!user) return null;
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return null;
    return { id: user.id, email: user.email, role: user.role };
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) throw new UnauthorizedException("Invalid credentials");

    const accessToken = await this.jwt.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return { accessToken, user };
  }
}
