import { DocumentsService } from "./documents.service";
export declare class DocumentsController {
    private readonly documents;
    constructor(documents: DocumentsService);
    list(): Promise<Record<string, unknown>[]>;
}
