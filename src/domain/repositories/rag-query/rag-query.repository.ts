import type { RagQuery } from "@domain/entities/rag-query/rag-query.entity";

export abstract class IRagQueryRepository {
  abstract save(ragQuery: RagQuery): Promise<void>;
  abstract findById(id: string): Promise<RagQuery | null>;
  abstract findByAskedBy(askedBy: string): Promise<RagQuery[]>;
}
