import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
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
      return "Request failed";
    };

    response.status(status).json({
      statusCode: status,
      message: normalizeMessage(rawBody),
      path: (request as any)?.url,
      timestamp: new Date().toISOString(),
    });
  }
}
