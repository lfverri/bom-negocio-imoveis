"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const corsOriginEnv = process.env.CORS_ORIGIN || process.env.WEB_ORIGIN;
    const allowedOrigins = (corsOriginEnv ?? "")
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
    app.enableCors({
        origin: process.env.NODE_ENV !== "production"
            ? true
            : (origin, callback) => {
                if (!origin)
                    return callback(null, true);
                if (allowedOrigins.length === 0)
                    return callback(null, false);
                return callback(null, allowedOrigins.includes(origin));
            },
        methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor(), new common_1.ClassSerializerInterceptor(app.get(core_1.Reflector)));
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle("Real State API")
        .setDescription("API documentation")
        .setVersion("1.0")
        .addBearerAuth()
        .build();
    const swaggerDocument = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup("docs", app, swaggerDocument);
    const port = process.env.PORT ? Number(process.env.PORT) : 3001;
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map