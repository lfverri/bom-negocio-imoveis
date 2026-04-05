import { BaseRepository } from "../../common/base.repository";
import { PrismaService } from "../../prisma/prisma.service";
export declare class LandlordPaymentsRepository extends BaseRepository<Record<string, unknown>> {
    constructor(prisma: PrismaService);
}
