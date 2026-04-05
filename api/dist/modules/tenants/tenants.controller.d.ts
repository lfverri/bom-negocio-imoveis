import { TenantsService } from "./tenants.service";
export declare class TenantsController {
    private readonly tenants;
    constructor(tenants: TenantsService);
    list(): Promise<Record<string, unknown>[]>;
}
