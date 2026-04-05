import { InsuranceService } from "./insurance.service";
export declare class InsuranceController {
    private readonly insurance;
    constructor(insurance: InsuranceService);
    list(): Promise<Record<string, unknown>[]>;
}
