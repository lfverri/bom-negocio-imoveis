import { Module } from "@nestjs/common";
import { InsuranceController } from "./insurance.controller";
import { InsuranceRepository } from "./insurance.repository";
import { InsuranceService } from "./insurance.service";

@Module({
  controllers: [InsuranceController],
  providers: [InsuranceService, InsuranceRepository],
})
export class InsuranceModule {}
