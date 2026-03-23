import { Controller, Get } from "@nestjs/common";
import { InsuranceService } from "./insurance.service";

@Controller("insurance")
export class InsuranceController {
  constructor(private readonly insurance: InsuranceService) {}

  @Get()
  list() {
    return this.insurance.list();
  }
}
