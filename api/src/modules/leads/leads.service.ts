import { Injectable } from "@nestjs/common";
import { LeadsRepository } from "./leads.repository";

@Injectable()
export class LeadsService {
  constructor(private readonly repo: LeadsRepository) {}

  list() {
    return this.repo.findMany();
  }

  create(input: { name?: string; email?: string }) {
    return this.repo.create(input);
  }
}
