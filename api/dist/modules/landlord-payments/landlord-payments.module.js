"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LandlordPaymentsModule = void 0;
const common_1 = require("@nestjs/common");
const landlord_payments_controller_1 = require("./landlord-payments.controller");
const landlord_payments_repository_1 = require("./landlord-payments.repository");
const landlord_payments_service_1 = require("./landlord-payments.service");
let LandlordPaymentsModule = class LandlordPaymentsModule {
};
exports.LandlordPaymentsModule = LandlordPaymentsModule;
exports.LandlordPaymentsModule = LandlordPaymentsModule = __decorate([
    (0, common_1.Module)({
        controllers: [landlord_payments_controller_1.LandlordPaymentsController],
        providers: [landlord_payments_service_1.LandlordPaymentsService, landlord_payments_repository_1.LandlordPaymentsRepository],
    })
], LandlordPaymentsModule);
//# sourceMappingURL=landlord-payments.module.js.map