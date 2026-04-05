import { InsuranceRepository } from "./insurance.repository";
export declare class InsuranceService {
    private readonly repo;
    constructor(repo: InsuranceRepository);
    list(): Promise<Record<string, unknown>[]>;
}
