import { LeadsService } from "./leads.service";
export declare class LeadsController {
    private readonly leads;
    constructor(leads: LeadsService);
    list(): import("./leads.repository").Lead[];
    create(body: {
        name?: string;
        email?: string;
    }): import("./leads.repository").Lead;
}
