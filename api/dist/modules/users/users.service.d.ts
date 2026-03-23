import { UsersRepository } from "./users.repository";
export declare class UsersService {
    private readonly repo;
    constructor(repo: UsersRepository);
    list(): import("./users.repository").User[];
}
