"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HttpExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let HttpExceptionFilter = HttpExceptionFilter_1 = class HttpExceptionFilter {
    logger = new common_1.Logger(HttpExceptionFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const isHttpException = exception instanceof common_1.HttpException;
        const status = isHttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const rawBody = isHttpException
            ? exception.getResponse()
            : { message: "Internal server error" };
        const normalizeMessage = (value) => {
            if (typeof value === "string")
                return value;
            if (Array.isArray(value))
                return value.map(String).join(", ");
            if (value && typeof value === "object") {
                const msg = value.message;
                if (typeof msg === "string")
                    return msg;
                if (Array.isArray(msg))
                    return msg.map(String).join(", ");
            }
            return status === common_1.HttpStatus.INTERNAL_SERVER_ERROR
                ? "Internal server error"
                : "Request failed";
        };
        const method = request?.method ?? "UNKNOWN";
        const path = request?.url ?? "";
        const message = normalizeMessage(rawBody);
        if (status >= 500) {
            this.logger.error(`${method} ${path} -> ${status} ${message}`, exception instanceof Error ? exception.stack : undefined);
        }
        else {
            this.logger.warn(`${method} ${path} -> ${status} ${message}`);
        }
        response.status(status).json({
            statusCode: status,
            message,
            path,
            timestamp: new Date().toISOString(),
        });
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = HttpExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], HttpExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map