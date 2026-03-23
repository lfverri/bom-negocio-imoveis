import { Module } from "@nestjs/common";
import { LeasesController } from "./leases.controller";
import { LeasesRepository } from "./leases.repository";
import { LeasesService } from "./leases.service";

@Module({
  controllers: [LeasesController],
  providers: [LeasesService, LeasesRepository],
})
export class LeasesModule {}
