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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadsController = void 0;
const common_1 = require("@nestjs/common");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const create_lead_activity_dto_1 = require("./dto/create-lead-activity.dto");
const create_lead_dto_1 = require("./dto/create-lead.dto");
const query_leads_dto_1 = require("./dto/query-leads.dto");
const update_lead_dto_1 = require("./dto/update-lead.dto");
const update_lead_status_dto_1 = require("./dto/update-lead-status.dto");
const leads_service_1 = require("./leads.service");
let LeadsController = class LeadsController {
    leads;
    constructor(leads) {
        this.leads = leads;
    }
    list(query) {
        return this.leads.list(query);
    }
    getById(id) {
        return this.leads.getById(id);
    }
    create(dto) {
        return this.leads.create(dto);
    }
    update(id, dto, req) {
        return this.leads.update(id, dto, req.user?.sub ?? "");
    }
    remove(id) {
        return this.leads.remove(id);
    }
    listActivities(id) {
        return this.leads.listActivities(id);
    }
    createActivity(id, req, dto) {
        return this.leads.createActivity(id, req.user?.sub ?? "", dto);
    }
    listStatusHistory(id) {
        return this.leads.listStatusHistory(id);
    }
    transitionStatus(id, req, dto) {
        return this.leads.transitionStatus(id, req.user?.sub ?? "", dto);
    }
};
exports.LeadsController = LeadsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_leads_dto_1.QueryLeadsDto]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id", new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "getById", null);
__decorate([
    (0, roles_decorator_1.Roles)("ADMIN", "MANAGER", "AGENT"),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_lead_dto_1.CreateLeadDto]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "create", null);
__decorate([
    (0, roles_decorator_1.Roles)("ADMIN", "MANAGER", "AGENT"),
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id", new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_lead_dto_1.UpdateLeadDto, Object]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "update", null);
__decorate([
    (0, roles_decorator_1.Roles)("ADMIN", "MANAGER"),
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id", new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(":id/activities"),
    __param(0, (0, common_1.Param)("id", new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "listActivities", null);
__decorate([
    (0, roles_decorator_1.Roles)("ADMIN", "MANAGER", "AGENT"),
    (0, common_1.Post)(":id/activities"),
    __param(0, (0, common_1.Param)("id", new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, create_lead_activity_dto_1.CreateLeadActivityDto]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "createActivity", null);
__decorate([
    (0, common_1.Get)(":id/status-history"),
    __param(0, (0, common_1.Param)("id", new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "listStatusHistory", null);
__decorate([
    (0, roles_decorator_1.Roles)("ADMIN", "MANAGER", "AGENT"),
    (0, common_1.Post)(":id/status-history"),
    __param(0, (0, common_1.Param)("id", new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_lead_status_dto_1.UpdateLeadStatusDto]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "transitionStatus", null);
exports.LeadsController = LeadsController = __decorate([
    (0, common_1.Controller)("leads"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN", "MANAGER", "AGENT", "VIEWER"),
    __metadata("design:paramtypes", [leads_service_1.LeadsService])
], LeadsController);
//# sourceMappingURL=leads.controller.js.map