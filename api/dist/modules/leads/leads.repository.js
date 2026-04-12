"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadsRepository = void 0;
const common_1 = require("@nestjs/common");
const base_repository_1 = require("../../common/base.repository");
const prisma_service_1 = require("../../prisma/prisma.service");
let LeadsRepository = class LeadsRepository extends base_repository_1.BaseRepository {
    prisma;
    constructor(prisma) {
        super(prisma.lead);
        this.prisma = prisma;
    }
    async list(query) {
        const page = query.page ?? 1;
        const pageSize = query.pageSize ?? 20;
        const skip = (page - 1) * pageSize;
        const where = {};
        if (query.name?.trim()) {
            where.name = {
                contains: query.name.trim(),
                mode: "insensitive",
            };
        }
        if (query.status)
            where.status = query.status;
        if (query.source)
            where.source = query.source;
        const [total, data] = await this.prisma.$transaction([
            this.prisma.lead.count({ where }),
            this.prisma.lead.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { createdAt: "desc" },
            }),
        ]);
        return {
            data,
            page,
            pageSize,
            total,
            totalPages: Math.max(1, Math.ceil(total / pageSize)),
        };
    }
    findOneById(id) {
        return this.prisma.lead.findUnique({ where: { id } });
    }
    createLead(dto) {
        return this.prisma.lead.create({
            data: {
                name: dto.name,
                email: dto.email ?? "lead@placeholder.local",
                phone: dto.phone ?? "0000000000",
                cpfCnpj: dto.cpfCnpj,
                source: (dto.source ?? "OTHER"),
                interestType: (dto.interestType ?? "RENT"),
                status: (dto.status ?? "NEW"),
                notes: dto.notes,
                assignedToId: dto.assignedToId,
                expectedBudgetMin: dto.expectedBudgetMin,
                expectedBudgetMax: dto.expectedBudgetMax,
                preferredRegions: dto.preferredRegions ?? [],
            },
        });
    }
    updateLead(id, dto) {
        return this.prisma.lead.update({
            where: { id },
            data: {
                ...dto,
                status: dto.status,
                source: dto.source,
                interestType: dto.interestType,
            },
        });
    }
    deleteLead(id) {
        return this.prisma.lead.delete({ where: { id } });
    }
    listActivities(leadId) {
        return this.prisma.leadActivity.findMany({
            where: { leadId },
            orderBy: { createdAt: "desc" },
        });
    }
    createActivity(leadId, userId, dto) {
        return this.prisma.leadActivity.create({
            data: {
                leadId,
                userId,
                type: dto.type,
                description: dto.description,
                scheduledAt: dto.scheduledAt,
                completedAt: dto.completedAt,
            },
        });
    }
    listStatusHistory(leadId) {
        return this.prisma.leadStatusHistory.findMany({
            where: { leadId },
            orderBy: { createdAt: "desc" },
        });
    }
    async transitionStatus(leadId, userId, dto) {
        const lead = await this.prisma.lead.findUnique({ where: { id: leadId } });
        if (!lead)
            return null;
        const [updatedLead] = await this.prisma.$transaction([
            this.prisma.lead.update({
                where: { id: leadId },
                data: { status: dto.status },
            }),
            this.prisma.leadStatusHistory.create({
                data: {
                    leadId,
                    userId,
                    previousStatus: lead.status,
                    newStatus: dto.status,
                    reason: dto.reason,
                },
            }),
            this.prisma.leadActivity.create({
                data: {
                    leadId,
                    userId,
                    type: "STATUS_CHANGE",
                    description: dto.reason ?? `Status changed to ${dto.status}`,
                },
            }),
        ]);
        return updatedLead;
    }
};
exports.LeadsRepository = LeadsRepository;
exports.LeadsRepository = LeadsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LeadsRepository);
//# sourceMappingURL=leads.repository.js.map