import { Module } from "@nestjs/common";
import { LandlordPaymentsController } from "./landlord-payments.controller";
import { LandlordPaymentsRepository } from "./landlord-payments.repository";
import { LandlordPaymentsService } from "./landlord-payments.service";

@Module({
  controllers: [LandlordPaymentsController],
  providers: [LandlordPaymentsService, LandlordPaymentsRepository],
})
export class LandlordPaymentsModule {}
