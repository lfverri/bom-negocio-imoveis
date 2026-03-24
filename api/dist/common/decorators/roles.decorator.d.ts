export declare const ROLES_KEY = "roles";
export type Role = "ADMIN" | "MANAGER" | "AGENT" | "VIEWER";
export declare const Roles: (...roles: Role[]) => import("@nestjs/common").CustomDecorator<string>;
