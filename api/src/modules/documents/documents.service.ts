import { Injectable } from "@nestjs/common";
import { DocumentsRepository } from "./documents.repository";

@Injectable()
export class DocumentsService {
  constructor(private readonly repo: DocumentsRepository) {}

  list() {
    return this.repo.findMany();
  }
}
