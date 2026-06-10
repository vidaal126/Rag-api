import { randomUUID } from 'node:crypto';
import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { Observable } from 'rxjs';

export type RequestWithTrace = FastifyRequest & { traceId: string };

@Injectable()
export class TraceIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<RequestWithTrace>();
    const response = ctx.getResponse<FastifyReply>();

    const traceId = (request.headers['x-trace-id'] as string | undefined) ?? randomUUID();
    request.traceId = traceId;
    void response.header('x-trace-id', traceId);

    return next.handle();
  }
}
