import { JwtService } from "@nestjs/jwt";
export declare class AuthService {
    private readonly jwt;
    private readonly users;
    constructor(jwt: JwtService);
    validateUser(email: string, password: string): Promise<{
        id: string;
        email: string;
        role: string;
    } | null>;
    login(email: string, password: string): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            role: string;
        };
    }>;
}
