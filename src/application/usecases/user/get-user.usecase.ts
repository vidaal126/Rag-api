import { UserNotFoundException } from '@domain/entities/user/user.exceptions';
import { type IUserRepository, USER_REPOSITORY } from '@domain/repositories/user/user.repository';
import { Inject, Injectable } from '@nestjs/common';
import type { GetUserInput, GetUserOutput } from './get-user.dto';

@Injectable()
export class GetUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: GetUserInput): Promise<GetUserOutput> {
    const user = await this.userRepository.findById(input.id);
    if (!user) {
      throw new UserNotFoundException(input.id);
    }

    return {
      id: user.id,
      email: user.email.value,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
