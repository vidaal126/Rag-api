import { Department } from "@domain/entities/document/document.value-objects";
import { RagQuery } from "@domain/entities/rag-query/rag-query.entity";
import {
  QueryText,
  RagQueryId,
  RagQueryStatus,
} from "@domain/entities/rag-query/rag-query.value-objects";
import type { RagQuery as PrismaRagQuery } from "@infrastructure/database/prisma/generated/prisma/client";

export class RagQueryMapper {
  static toDomain(raw: PrismaRagQuery): RagQuery {
    return RagQuery.reconstitute({
      id: new RagQueryId(raw.id),
      queryText: new QueryText(raw.queryText),
      answer: raw.answer,
      askedBy: raw.askedBy,
      department: raw.department as Department,
      status: raw.status as RagQueryStatus,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPrisma(
    ragQuery: RagQuery,
  ): Omit<PrismaRagQuery, "createdAt" | "updatedAt"> {
    return {
      id: ragQuery.id.value,
      queryText: ragQuery.queryText.value,
      answer: ragQuery.answer,
      askedBy: ragQuery.askedBy,
      department: ragQuery.department,
      status: ragQuery.status,
    };
  }
}
