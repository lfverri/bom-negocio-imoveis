import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
export declare class SicoobService {
    private readonly http;
    private readonly config;
    constructor(http: HttpService, config: ConfigService);
    ping(): Promise<{
        ok: boolean;
        configured: boolean;
        status?: undefined;
    } | {
        ok: boolean;
        status: number;
        configured?: undefined;
    }>;
}
