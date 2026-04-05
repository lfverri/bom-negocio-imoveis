import { PropertiesService } from "./properties.service";
export declare class PropertiesController {
    private readonly properties;
    constructor(properties: PropertiesService);
    list(): Promise<Record<string, unknown>[]>;
}
