import { DocumentsRepository } from "./documents.repository";
export declare class DocumentsService {
    private readonly repo;
    constructor(repo: DocumentsRepository);
    list(): Promise<Record<string, unknown>[]>;
}
