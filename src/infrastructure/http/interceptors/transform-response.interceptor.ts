import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import { map, type Observable } from 'rxjs';
import type { RequestWithTrace } from './trace-id.interceptor';

export interface IStandardResponse<T> {
  statusCode: number;
  timestamp: string;
  path: string;
  traceId: string;
  data?: T;
}

@Injectable()
export class TransformResponseInterceptor<T> implements NestInterceptor<T, IStandardResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<IStandardResponse<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<RequestWithTrace>();
    const response = ctx.getResponse<FastifyReply>();

    return next.handle().pipe(
      map(
        (data): IStandardResponse<T> => ({
          statusCode: response.statusCode,
          timestamp: new Date().toISOString(),
          path: request.url,
          traceId: request.traceId ?? '',
          data,
        }),
      ),
    );
  }
}
