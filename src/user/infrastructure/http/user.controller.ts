import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import { GetUserUseCase } from 'src/user/application/get-user.use-case';
import { UserNotFoundError } from 'src/user/domain/errors/user-not-found.error';
import { User } from 'src/user/domain/user';

/**
 * Controller for user-related operations
 */
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly getUserUseCase: GetUserUseCase) {}

  /**
   * Retrieves a user by their ID
   * Only allows authenticated users to access their own data
   *
   * @param session - The authenticated user session
   * @param id - The user ID to retrieve
   * @returns The user entity
   * @throws UnauthorizedException if the session user ID doesn't match the requested ID
   * @throws NotFoundException if the user is not found
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: String })
  @ApiResponse({
    status: 200,
    description: 'User found successfully',
    type: User,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - User can only access their own data',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUser(
    @Session() session: UserSession,
    @Param('id') id: string,
  ): Promise<User> {
    if (session.user.id !== id) {
      throw new UnauthorizedException();
    }

    try {
      const user = await this.getUserUseCase.execute(id);
      return user;
    } catch (e: unknown) {
      if (e instanceof UserNotFoundError) {
        throw new NotFoundException();
      }

      throw e;
    }
  }
}
