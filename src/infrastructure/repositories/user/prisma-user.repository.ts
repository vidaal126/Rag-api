import type { User } from '@domain/entities/user/user.entity';
import { UserAlreadyExistsException } from '@domain/entities/user/user.exceptions';
import type { IUserRepository } from '@domain/repositories/user/user.repository';
import { Prisma } from '@infrastructure/database/prisma/generated/prisma/client';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import { UserMapper } from '@infrastructure/mappers/user.mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(user: User): Promise<void> {
    try {
      await this.prisma.user.create({ data: UserMapper.toPrisma(user) });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new UserAlreadyExistsException(user.email.value);
      }
      throw e;
    }
  }

  async findById(id: string): Promise<User | null> {
    const raw = await this.prisma.user.findUnique({ where: { id } });
    return raw ? UserMapper.toDomain(raw) : null;
  }
}
