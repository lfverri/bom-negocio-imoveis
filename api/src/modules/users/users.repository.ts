import { Injectable } from "@nestjs/common";
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

@Injectable()
export class UsersRepository extends BaseRepository<User> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.user as any);
  }

  findByIdentifier(identifier: string) {
    const cpf = identifier.replace(/\D/g, "");

    return this.prisma.user.findFirst({
      where: {
        OR: [
          {
            email: {
              equals: identifier,
              mode: "insensitive",
            },
          },
          ...(cpf.length
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
  }
}
