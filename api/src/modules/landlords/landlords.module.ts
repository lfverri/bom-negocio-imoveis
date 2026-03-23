import { Module } from "@nestjs/common";
import { LandlordsController } from "./landlords.controller";
import { LandlordsRepository } from "./landlords.repository";
import { LandlordsService } from "./landlords.service";

@Module({
  controllers: [LandlordsController],
  providers: [LandlordsService, LandlordsRepository],
})
export class LandlordsModule {}
