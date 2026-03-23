import { Controller, Get } from "@nestjs/common";
import { LeasesService } from "./leases.service";

@Controller("leases")
export class LeasesController {
  constructor(private readonly leases: LeasesService) {}

  @Get()
  list() {
    return this.leases.list();
  }
}
