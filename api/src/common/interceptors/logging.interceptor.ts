import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, tap } from "rxjs";

type RequestWithContext = {
  method?: string;
  originalUrl?: string;
  url?: string;
  id?: string;
};

type ResponseWithContext = {
  statusCode?: number;
};

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const now = Date.now();

    if (context.getType() !== "http") {
      return next.handle();
    }

    const http = context.switchToHttp();
    const request = http.getRequest<RequestWithContext>();
    const response = http.getResponse<ResponseWithContext>();

    const method = request.method ?? "UNKNOWN";
    const path = request.originalUrl ?? request.url ?? "";
    const requestId = request.id ?? "n/a";

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - now;
          this.logger.log(
            `${method} ${path} ${response.statusCode ?? 0} ${duration}ms reqId=${requestId}`,
          );
        },
        error: () => {
          const duration = Date.now() - now;
          this.logger.error(
            `${method} ${path} ${response.statusCode ?? 500} ${duration}ms reqId=${requestId}`,
          );
        },
      }),
    );
  }
}
