import { Injectable } from '@nestjs/common';
import { InvalidUserIdError } from '../domain/errors/invalid-user-id';
import { UserNotFoundError } from '../domain/errors/user-not-found.error';
import { UserRepository } from '../ports/repositories/user.repository.port';
import { UpdateUserDTO } from '../domain/dtos/update-user.dto';

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    userId: string | null | undefined,
    updateUserDTO: UpdateUserDTO,
  ) {
    if (!userId) {
      throw new InvalidUserIdError(userId);
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }

    user.setName(updateUserDTO.name);
    await this.userRepository.updateUser(userId, user);
  }
}
