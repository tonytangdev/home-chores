import { Module, Provider } from '@nestjs/common';
import { UserController } from './infrastructure/http/user.controller';
import { GetUserUseCase } from './application/get-user.use-case';
import { UserRepositoryDrizzleImpl } from './infrastructure/repositories/orm/drizzle/user.repository.drizzle-impl';
import { UserRepository } from './ports/repositories/user.repository.port';
import { UpdateUserUseCase } from './application/update-user.use-case';

const applicationProviders: Provider[] = [GetUserUseCase, UpdateUserUseCase];

const infrastructureProviders: Provider[] = [
  {
    provide: UserRepository,
    useClass: UserRepositoryDrizzleImpl,
  },
];

@Module({
  imports: [],
  controllers: [UserController],
  providers: [...applicationProviders, ...infrastructureProviders],
})
export class UserModule {}
