type Delegate = {
    findMany(args?: Record<string, unknown>): Promise<unknown[]>;
    findUnique(args: Record<string, unknown>): Promise<unknown | null>;
    create(args: Record<string, unknown>): Promise<unknown>;
    update(args: Record<string, unknown>): Promise<unknown>;
    delete(args: Record<string, unknown>): Promise<unknown>;
};
type CrudOptions = {
    idField?: string;
};
export declare class BaseRepository<T extends object> {
    protected readonly delegate: Delegate;
    private readonly options;
    constructor(delegate: Delegate, options?: CrudOptions);
    findMany(args?: Record<string, unknown>): Promise<T[]>;
    findById(id: string, args?: Record<string, unknown>): Promise<T>;
    create(data: Record<string, unknown>): Promise<T>;
    update(id: string, data: Record<string, unknown>): Promise<T>;
    delete(id: string): Promise<T>;
    protected rethrowPrismaError(error: unknown): never;
}
export {};
