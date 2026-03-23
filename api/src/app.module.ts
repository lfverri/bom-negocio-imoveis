import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import configuration from "./config/configuration";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { LeadsModule } from "./modules/leads/leads.module";
import { TenantsModule } from "./modules/tenants/tenants.module";
import { LandlordsModule } from "./modules/landlords/landlords.module";
import { PropertiesModule } from "./modules/properties/properties.module";
import { LeasesModule } from "./modules/leases/leases.module";
import { PaymentsModule } from "./modules/payments/payments.module";
import { LandlordPaymentsModule } from "./modules/landlord-payments/landlord-payments.module";
import { InsuranceModule } from "./modules/insurance/insurance.module";
import { InspectionsModule } from "./modules/inspections/inspections.module";
import { DocumentsModule } from "./modules/documents/documents.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { SicoobModule } from "./modules/integrations/sicoob/sicoob.module";
import { AppController } from "./app.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    LeadsModule,
    TenantsModule,
    LandlordsModule,
    PropertiesModule,
    LeasesModule,
    PaymentsModule,
    LandlordPaymentsModule,
    InsuranceModule,
    InspectionsModule,
    DocumentsModule,
    DashboardModule,
    SicoobModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
