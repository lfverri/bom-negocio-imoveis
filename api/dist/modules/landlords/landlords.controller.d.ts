import { LandlordsService } from "./landlords.service";
export declare class LandlordsController {
    private readonly landlords;
    constructor(landlords: LandlordsService);
    list(): Promise<Record<string, unknown>[]>;
}
