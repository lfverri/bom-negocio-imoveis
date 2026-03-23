import { Injectable } from "@nestjs/common";
import { LandlordPaymentsRepository } from "./landlord-payments.repository";

@Injectable()
export class LandlordPaymentsService {
  constructor(private readonly repo: LandlordPaymentsRepository) {}

  list() {
    return this.repo.findMany();
  }
}
