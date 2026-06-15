import { Injectable } from "@nestjs/common";
import { ThrottlerGuard } from "@nestjs/throttler";
import type { FastifyRequest } from "fastify";

interface RequestBody {
  askedBy?: string;
  uploadedBy?: string;
}

interface RequestQuery {
  askedBy?: string;
  uploadedBy?: string;
}

@Injectable()
export class UserThrottlerGuard extends ThrottlerGuard {
  protected override getTracker(req: FastifyRequest): Promise<string> {
    const body = req.body as RequestBody | undefined;
    const query = req.query as RequestQuery | undefined;

    const userId =
      body?.askedBy ??
      body?.uploadedBy ??
      query?.askedBy ??
      query?.uploadedBy ??
      req.ip;

    return Promise.resolve(userId);
  }
}
