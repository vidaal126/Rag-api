import type { CreateUserInput } from '@application/usecases/user/create-user.dto';
import type { CreateUserRequestDto } from '@presentation/dtos/user/create-user-request.dto';

export class UserHttpMapper {
  static toCreateInput(dto: CreateUserRequestDto): CreateUserInput {
    return {
      email: dto.email,
      name: dto.name,
    };
  }
}
