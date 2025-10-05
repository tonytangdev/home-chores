import { Injectable } from '@nestjs/common';
import { User } from '../domain/user';
import { UserNotFoundError } from '../domain/errors/user-not-found.error';
import { UserRepository } from '../ports/repositories/user.repository.port';
import { InvalidUserIdError } from '../domain/errors/invalid-user-id';

@Injectable()
export class GetUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string | null | undefined): Promise<User> {
    if (!id) throw new InvalidUserIdError(id);

    const user = await this.userRepository.findById(id);
    if (!user) throw new UserNotFoundError(id);
    return user;
  }
}
