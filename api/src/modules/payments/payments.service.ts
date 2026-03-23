import { Injectable } from "@nestjs/common";
import { PaymentsRepository } from "./payments.repository";

@Injectable()
export class PaymentsService {
  constructor(private readonly repo: PaymentsRepository) {}

  list() {
    return this.repo.findMany();
  }
}
