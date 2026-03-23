import { Controller, Get } from "@nestjs/common";
import { InspectionsService } from "./inspections.service";

@Controller("inspections")
export class InspectionsController {
  constructor(private readonly inspections: InspectionsService) {}

  @Get()
  list() {
    return this.inspections.list();
  }
}
