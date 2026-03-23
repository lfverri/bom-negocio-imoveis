import { Injectable } from "@nestjs/common";
import { TenantsRepository } from "./tenants.repository";

@Injectable()
export class TenantsService {
  constructor(private readonly repo: TenantsRepository) {}

  list() {
    return this.repo.findMany();
  }
}
