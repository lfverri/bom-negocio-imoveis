import { LeadsRepository } from "./leads.repository";
export declare class LeadsService {
    private readonly repo;
    constructor(repo: LeadsRepository);
    list(): import("./leads.repository").Lead[];
    create(input: {
        name?: string;
        email?: string;
    }): import("./leads.repository").Lead;
}
