import { IRagQueryRepository } from "@domain/repositories/rag-query/rag-query.repository";
import { RagQuery } from "@domain/entities/rag-query/rag-query.entity";
import { RagQueryMapper } from "@infrastructure/mappers/rag-query.mapper";
import { PrismaService } from "@infrastructure/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaRagQueryRepository extends IRagQueryRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async save(ragQuery: RagQuery): Promise<void> {
    const data = RagQueryMapper.toPrisma(ragQuery);

    await this.prisma.ragQuery.upsert({
      where: { id: data.id },
      create: data,
      update: {
        answer: data.answer,
        status: data.status,
      },
    });
  }

  async findById(id: string): Promise<RagQuery | null> {
    const raw = await this.prisma.ragQuery.findUnique({ where: { id } });

    if (!raw) return null;

    return RagQueryMapper.toDomain(raw);
  }

  async findByAskedBy(askedBy: string): Promise<RagQuery[]> {
    const raws = await this.prisma.ragQuery.findMany({ where: { askedBy } });

    return raws.map(RagQueryMapper.toDomain);
  }
}
