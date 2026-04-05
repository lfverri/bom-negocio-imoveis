import { BaseRepository } from "../../common/base.repository";
import { PrismaService } from "../../prisma/prisma.service";
export declare class LeasesRepository extends BaseRepository<Record<string, unknown>> {
    constructor(prisma: PrismaService);
}
