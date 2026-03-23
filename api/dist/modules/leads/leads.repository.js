"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadsRepository = void 0;
const common_1 = require("@nestjs/common");
let LeadsRepository = class LeadsRepository {
    leads = [];
    findMany() {
        return this.leads;
    }
    create(data) {
        const created = { id: String(Date.now()), ...data };
        this.leads.push(created);
        return created;
    }
};
exports.LeadsRepository = LeadsRepository;
exports.LeadsRepository = LeadsRepository = __decorate([
    (0, common_1.Injectable)()
], LeadsRepository);
//# sourceMappingURL=leads.repository.js.map