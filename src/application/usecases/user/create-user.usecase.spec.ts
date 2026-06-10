import {
  InvalidEmailException,
  UserAlreadyExistsException,
} from '@domain/entities/user/user.exceptions';
import { UserInMemoryRepository } from '@infrastructure/repositories/in-memory/user-in-memory.repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { CreateUserUseCase } from './create-user.usecase';

describe('CreateUserUseCase', () => {
  let repository: UserInMemoryRepository;
  let useCase: CreateUserUseCase;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    useCase = new CreateUserUseCase(repository);
  });

  it('creates a user and returns the output DTO', async () => {
    const output = await useCase.execute({ email: 'jane@example.com', name: 'Jane Doe' });

    expect(output.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(output.email).toBe('jane@example.com');
    expect(output.name).toBe('Jane Doe');

    const persisted = await repository.findById(output.id);
    expect(persisted).not.toBeNull();
  });

  it('rejects an invalid email', async () => {
    await expect(useCase.execute({ email: 'invalid', name: 'Jane' })).rejects.toThrow(
      InvalidEmailException,
    );
  });

  it('rejects a duplicate email', async () => {
    await useCase.execute({ email: 'jane@example.com', name: 'Jane' });

    await expect(useCase.execute({ email: 'jane@example.com', name: 'Other' })).rejects.toThrow(
      UserAlreadyExistsException,
    );
  });
});
