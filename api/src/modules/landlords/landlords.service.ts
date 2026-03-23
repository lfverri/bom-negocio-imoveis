import { Injectable } from "@nestjs/common";
import { LandlordsRepository } from "./landlords.repository";

@Injectable()
export class LandlordsService {
  constructor(private readonly repo: LandlordsRepository) {}

  list() {
    return this.repo.findMany();
  }
}
