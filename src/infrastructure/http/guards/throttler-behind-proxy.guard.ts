import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import type { FastifyRequest } from 'fastify';

@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  protected getTracker(req: FastifyRequest): Promise<string> {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
      return Promise.resolve(forwarded.split(',')[0].trim());
    }
    return Promise.resolve(req.ip ?? 'unknown');
  }
}
