import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../../common/base.repository";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class InspectionsRepository extends BaseRepository<
  Record<string, unknown>
> {
  constructor(prisma: PrismaService) {
    super(prisma.inspection as any);
  }
}
