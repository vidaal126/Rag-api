import { CreateUserUseCase } from '@application/usecases/user/create-user.usecase';
import { GetUserUseCase } from '@application/usecases/user/get-user.usecase';
import { USER_REPOSITORY } from '@domain/repositories/user/user.repository';
import { PrismaUserRepository } from '@infrastructure/repositories/user/prisma-user.repository';
import { Module } from '@nestjs/common';
import { UserController } from '@presentation/controllers/v1/user.controller';

@Module({
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    GetUserUseCase,
    { provide: USER_REPOSITORY, useClass: PrismaUserRepository },
  ],
})
export class UserModule {}
