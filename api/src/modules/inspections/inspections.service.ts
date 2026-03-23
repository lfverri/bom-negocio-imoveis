import { Injectable } from "@nestjs/common";
import { InspectionsRepository } from "./inspections.repository";

@Injectable()
export class InspectionsService {
  constructor(private readonly repo: InspectionsRepository) {}

  list() {
    return this.repo.findMany();
  }
}
