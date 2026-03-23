"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const configuration_1 = require("./config/configuration");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const leads_module_1 = require("./modules/leads/leads.module");
const tenants_module_1 = require("./modules/tenants/tenants.module");
const landlords_module_1 = require("./modules/landlords/landlords.module");
const properties_module_1 = require("./modules/properties/properties.module");
const leases_module_1 = require("./modules/leases/leases.module");
const payments_module_1 = require("./modules/payments/payments.module");
const landlord_payments_module_1 = require("./modules/landlord-payments/landlord-payments.module");
const insurance_module_1 = require("./modules/insurance/insurance.module");
const inspections_module_1 = require("./modules/inspections/inspections.module");
const documents_module_1 = require("./modules/documents/documents.module");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const sicoob_module_1 = require("./modules/integrations/sicoob/sicoob.module");
const app_controller_1 = require("./app.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default],
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            leads_module_1.LeadsModule,
            tenants_module_1.TenantsModule,
            landlords_module_1.LandlordsModule,
            properties_module_1.PropertiesModule,
            leases_module_1.LeasesModule,
            payments_module_1.PaymentsModule,
            landlord_payments_module_1.LandlordPaymentsModule,
            insurance_module_1.InsuranceModule,
            inspections_module_1.InspectionsModule,
            documents_module_1.DocumentsModule,
            dashboard_module_1.DashboardModule,
            sicoob_module_1.SicoobModule,
        ],
        controllers: [app_controller_1.AppController],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map