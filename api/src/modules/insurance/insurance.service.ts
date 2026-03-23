import { Injectable } from "@nestjs/common";
import { InsuranceRepository } from "./insurance.repository";

@Injectable()
export class InsuranceService {
  constructor(private readonly repo: InsuranceRepository) {}

  list() {
    return this.repo.findMany();
  }
}
