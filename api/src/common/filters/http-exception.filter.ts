import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const rawBody = isHttpException
      ? exception.getResponse()
      : { message: "Internal server error" };

    const normalizeMessage = (value: unknown): string => {
      if (typeof value === "string") return value;
      if (Array.isArray(value)) return value.map(String).join(", ");
      if (value && typeof value === "object") {
        const msg = (value as any).message;
        if (typeof msg === "string") return msg;
        if (Array.isArray(msg)) return msg.map(String).join(", ");
      }
      return status === HttpStatus.INTERNAL_SERVER_ERROR
        ? "Internal server error"
        : "Request failed";
    };

    const method = (request as any)?.method ?? "UNKNOWN";
    const path = (request as any)?.url ?? "";
    const message = normalizeMessage(rawBody);

    if (status >= 500) {
      this.logger.error(
        `${method} ${path} -> ${status} ${message}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    } else {
      this.logger.warn(`${method} ${path} -> ${status} ${message}`);
    }

    response.status(status).json({
      statusCode: status,
      message,
      path,
      timestamp: new Date().toISOString(),
    });
  }
}
