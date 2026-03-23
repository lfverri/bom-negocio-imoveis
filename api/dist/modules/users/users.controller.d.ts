import { UsersService } from "./users.service";
export declare class UsersController {
    private readonly users;
    constructor(users: UsersService);
    list(): import("./users.repository").User[];
}
