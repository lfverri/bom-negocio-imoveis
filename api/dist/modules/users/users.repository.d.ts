export type User = {
    id: string;
    email: string;
    role: string;
};
export declare class UsersRepository {
    private readonly users;
    findMany(): User[];
}
