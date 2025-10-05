import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

/**
 * Data transfer object for updating user information
 */
export class UpdateUserDTO {
  /**
   * The user's display name
   * @example "John Doe"
   */
  @ApiProperty({
    description: "The user's display name",
    example: 'John Doe',
  })
  @IsNotEmpty()
  name: string;
}
