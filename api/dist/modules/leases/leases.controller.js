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
exports.LeasesController = void 0;
const common_1 = require("@nestjs/common");
const leases_service_1 = require("./leases.service");
let LeasesController = class LeasesController {
    leases;
    constructor(leases) {
        this.leases = leases;
    }
    list() {
        return this.leases.list();
    }
};
exports.LeasesController = LeasesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LeasesController.prototype, "list", null);
exports.LeasesController = LeasesController = __decorate([
    (0, common_1.Controller)("leases"),
    __metadata("design:paramtypes", [leases_service_1.LeasesService])
], LeasesController);
//# sourceMappingURL=leases.controller.js.map