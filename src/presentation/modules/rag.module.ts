import { ContentSanitizerService } from "@application/services/content-sanitizer.service";
import { ProcessQueryUseCase } from "@application/usecases/process-query/process-query.usecase";
import { IRagQueryRepository } from "@domain/repositories/rag-query/rag-query.repository";
import { IEmbeddingProvider } from "@domain/services/embedding.provider";
import { ILlmProvider } from "@domain/services/llm.provider";
import { IVectorStore } from "@domain/services/vector-store";
import { OllamaEmbeddingAdapter } from "@infrastructure/external/ollama/ollama-embedding.adapter";
import { OllamaLlmAdapter } from "@infrastructure/external/ollama/ollama-llm.adapter";
import { PrismaRagQueryRepository } from "@infrastructure/repositories/rag-query/rag-query.repository";
import { PgVectorStore } from "@infrastructure/services/pg-vector-store";
import { Module } from "@nestjs/common";
import { RagController } from "@presentation/controllers/v1/rag.controller";

@Module({
  providers: [
    ProcessQueryUseCase,
    ContentSanitizerService,
    { provide: IRagQueryRepository, useClass: PrismaRagQueryRepository },
    { provide: IEmbeddingProvider, useClass: OllamaEmbeddingAdapter },
    { provide: ILlmProvider, useClass: OllamaLlmAdapter },
    { provide: IVectorStore, useClass: PgVectorStore },
  ],
  controllers: [RagController],
})
export class RagModule {}
