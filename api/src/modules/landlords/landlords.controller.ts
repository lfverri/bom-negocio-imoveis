import { Controller, Get } from "@nestjs/common";
import { LandlordsService } from "./landlords.service";

@Controller("landlords")
export class LandlordsController {
  constructor(private readonly landlords: LandlordsService) {}

  @Get()
  list() {
    return this.landlords.list();
  }
}
