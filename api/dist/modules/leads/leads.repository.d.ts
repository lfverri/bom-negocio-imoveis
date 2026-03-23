export type Lead = {
    id: string;
    name?: string;
    email?: string;
};
export declare class LeadsRepository {
    private readonly leads;
    findMany(): Lead[];
    create(data: Omit<Lead, "id">): Lead;
}
