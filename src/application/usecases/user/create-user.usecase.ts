import { Email } from '@domain/entities/user/email.vo';
import { User } from '@domain/entities/user/user.entity';
import { type IUserRepository, USER_REPOSITORY } from '@domain/repositories/user/user.repository';
import { Inject, Injectable } from '@nestjs/common';
import type { CreateUserInput, CreateUserOutput } from './create-user.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: CreateUserInput): Promise<CreateUserOutput> {
    const email = Email.create(input.email);

    const user = User.register(email, input.name);

    await this.userRepository.save(user);

    return {
      id: user.id,
      email: user.email.value,
      name: user.name,
      createdAt: user.createdAt,
    };
  }
}
