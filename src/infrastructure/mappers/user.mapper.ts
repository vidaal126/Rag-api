import { Email } from '@domain/entities/user/email.vo';
import { User } from '@domain/entities/user/user.entity';
import type {
  UserCreateInput,
  UserModel,
} from '@infrastructure/database/prisma/generated/prisma/models';

export class UserMapper {
  static toDomain(raw: UserModel): User {
    return User.reconstitute({
      id: raw.id,
      email: Email.reconstitute(raw.email),
      name: raw.name,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPrisma(user: User): UserCreateInput {
    return {
      id: user.id,
      email: user.email.value,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
