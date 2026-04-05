import { InspectionsService } from "./inspections.service";
export declare class InspectionsController {
    private readonly inspections;
    constructor(inspections: InspectionsService);
    list(): Promise<Record<string, unknown>[]>;
}
