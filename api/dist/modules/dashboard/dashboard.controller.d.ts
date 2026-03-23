import { DashboardService } from "./dashboard.service";
export declare class DashboardController {
    private readonly dashboard;
    constructor(dashboard: DashboardService);
    summary(): {
        ok: boolean;
    };
}
