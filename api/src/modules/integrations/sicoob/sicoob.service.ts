import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";

@Injectable()
export class SicoobService {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  async ping() {
    const baseUrl = this.config.get<string>("sicoob.baseUrl");
    if (!baseUrl) return { ok: true, configured: false };

    const res = await firstValueFrom(
      this.http.get(`${baseUrl.replace(/\/$/, "")}/ping`),
    );
    return { ok: true, status: res.status };
  }
}
