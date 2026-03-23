import { Injectable } from "@nestjs/common";
import { PropertiesRepository } from "./properties.repository";

@Injectable()
export class PropertiesService {
  constructor(private readonly repo: PropertiesRepository) {}

  list() {
    return this.repo.findMany();
  }
}
