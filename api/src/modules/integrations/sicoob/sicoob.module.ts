import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { SicoobService } from "./sicoob.service";

@Module({
  imports: [HttpModule],
  providers: [SicoobService],
  exports: [SicoobService],
})
export class SicoobModule {}
