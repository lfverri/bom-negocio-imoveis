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
exports.LeadsService = void 0;
const common_1 = require("@nestjs/common");
const leads_repository_1 = require("./leads.repository");
let LeadsService = class LeadsService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    list(query) {
        return this.repo.list(query);
    }
    async getById(id) {
        const lead = await this.repo.findOneById(id);
        if (!lead)
            throw new common_1.NotFoundException("Lead not found");
        return lead;
    }
    create(dto) {
        return this.repo.createLead(dto);
    }
    async update(id, dto, actorId) {
        if (!actorId) {
            throw new common_1.UnauthorizedException("Missing authenticated user");
        }
        const current = await this.repo.findOneById(id);
        if (!current)
            throw new common_1.NotFoundException("Lead not found");
        const updated = await this.repo.updateLead(id, dto);
        if (dto.status && dto.status !== current.status) {
            await this.repo.transitionStatus(id, actorId, {
                status: dto.status,
                reason: "Status updated via lead PATCH",
            });
            return this.getById(id);
        }
        return updated;
    }
    async remove(id) {
        const current = await this.repo.findOneById(id);
        if (!current)
            throw new common_1.NotFoundException("Lead not found");
        return this.repo.deleteLead(id);
    }
    async listActivities(leadId) {
        await this.getById(leadId);
        return this.repo.listActivities(leadId);
    }
    async createActivity(leadId, userId, dto) {
        if (!userId) {
            throw new common_1.UnauthorizedException("Missing authenticated user");
        }
        await this.getById(leadId);
        return this.repo.createActivity(leadId, userId, dto);
    }
    async listStatusHistory(leadId) {
        await this.getById(leadId);
        return this.repo.listStatusHistory(leadId);
    }
    async transitionStatus(leadId, userId, dto) {
        if (!userId) {
            throw new common_1.UnauthorizedException("Missing authenticated user");
        }
        const updated = await this.repo.transitionStatus(leadId, userId, dto);
        if (!updated)
            throw new common_1.NotFoundException("Lead not found");
        return updated;
    }
};
exports.LeadsService = LeadsService;
exports.LeadsService = LeadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [leads_repository_1.LeadsRepository])
], LeadsService);
//# sourceMappingURL=leads.service.js.map