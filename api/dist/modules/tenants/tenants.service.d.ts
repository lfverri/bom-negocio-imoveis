import { TenantsRepository } from "./tenants.repository";
export declare class TenantsService {
    private readonly repo;
    constructor(repo: TenantsRepository);
    list(): never[];
}
