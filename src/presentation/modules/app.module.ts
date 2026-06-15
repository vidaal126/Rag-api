import type { IncomingMessage, ServerResponse } from "node:http";
import { envValidationSchema } from "@config/env.validation";
import { HttpExceptionFilter } from "@infrastructure/http/filters/http-exception.filter";
import { TraceIdInterceptor } from "@infrastructure/http/interceptors/trace-id.interceptor";
import { TransformResponseInterceptor } from "@infrastructure/http/interceptors/transform-response.interceptor";
import { Module, RequestMethod } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { ThrottlerModule } from "@nestjs/throttler";
import { LoggerModule, type Params } from "nestjs-pino";
import type { LevelWithSilent } from "pino";
import { DocumentModule } from "./document.module";
import { RagModule } from "./rag.module";
import { SharedModule } from "./shared.module";
import { UserModule } from "./user.module";
import { UserThrottlerGuard } from "@infrastructure/http/guards/throttler-behind-proxy.guard";

interface PinoRequest extends IncomingMessage {
  routeOptions?: { url?: string };
  traceId?: string;
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 30 }]),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): Params => ({
        forRoutes: [{ path: "*path", method: RequestMethod.ALL }],
        pinoHttp: {
          level: config.get<string>("LOG_LEVEL", "info"),
          transport:
            config.get<string>("NODE_ENV") !== "production"
              ? { target: "pino-pretty", options: { singleLine: true } }
              : undefined,
          customAttributeKeys: { responseTime: "duration" },
          customLogLevel: (
            _req: PinoRequest,
            res: ServerResponse<IncomingMessage>,
            err: Error | undefined,
          ): LevelWithSilent => {
            if (res.statusCode >= 500 || err) return "error";
            if (res.statusCode >= 400) return "warn";
            return "info";
          },
          autoLogging: {
            ignore: (req: PinoRequest): boolean => req.url === "/health",
          },
          serializers: {
            req: (): Record<string, never> => ({}),
            res: (): Record<string, never> => ({}),
          },
          customProps: (req: PinoRequest): Record<string, unknown> => ({
            traceId: req.traceId,
            route: req.routeOptions?.url ?? req.url,
          }),
          redact: {
            paths: ["req", "res"],
            remove: true,
          },
        },
      }),
    }),
    SharedModule,
    UserModule,
    DocumentModule,
    RagModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: UserThrottlerGuard },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: TraceIdInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TransformResponseInterceptor },
  ],
})
export class AppModule {}
