import { Injectable } from "@nestjs/common";
import { LeasesRepository } from "./leases.repository";

@Injectable()
export class LeasesService {
  constructor(private readonly repo: LeasesRepository) {}

  list() {
    return this.repo.findMany();
  }
}
