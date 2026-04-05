import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../../common/base.repository";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class PropertiesRepository extends BaseRepository<
  Record<string, unknown>
> {
  constructor(prisma: PrismaService) {
    super(prisma.property as any);
  }
}
