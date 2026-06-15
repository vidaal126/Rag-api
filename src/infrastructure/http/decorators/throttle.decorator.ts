import { Throttle } from "@nestjs/throttler";

// 20 queries por minuto
export const QueryThrottle = (): MethodDecorator =>
  Throttle({ default: { limit: 20, ttl: 60_000 } });

// 10 uploads por hora
export const UploadThrottle = (): MethodDecorator =>
  Throttle({ default: { limit: 10, ttl: 3_600_000 } });
