import { Controller, Get } from "@nestjs/common";
import { LandlordPaymentsService } from "./landlord-payments.service";

@Controller("landlord-payments")
export class LandlordPaymentsController {
  constructor(private readonly landlordPayments: LandlordPaymentsService) {}

  @Get()
  list() {
    return this.landlordPayments.list();
  }
}
