import type { User } from '@domain/entities/user/user.entity';
import { UserAlreadyExistsException } from '@domain/entities/user/user.exceptions';
import type { IUserRepository } from '@domain/repositories/user/user.repository';

export class UserInMemoryRepository implements IUserRepository {
  private readonly users = new Map<string, User>();

  save(user: User): Promise<void> {
    for (const existing of this.users.values()) {
      if (existing.email.equals(user.email) && existing.id !== user.id) {
        return Promise.reject(new UserAlreadyExistsException(user.email.value));
      }
    }
    this.users.set(user.id, user);
    return Promise.resolve();
  }

  findById(id: string): Promise<User | null> {
    return Promise.resolve(this.users.get(id) ?? null);
  }
}
