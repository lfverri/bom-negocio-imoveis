import { Injectable } from "@nestjs/common";

@Injectable()
export class DashboardService {
  summary() {
    return { ok: true };
  }
}
