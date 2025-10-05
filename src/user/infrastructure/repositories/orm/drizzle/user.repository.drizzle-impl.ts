import { eq } from 'drizzle-orm';
import { db } from 'src/db/db';
import { user } from 'src/db/schemas/auth-schema';
import { User } from 'src/user/domain/user';
import { UserRepository } from 'src/user/ports/repositories/user.repository.port';

export class UserRepositoryDrizzleImpl implements UserRepository {
  private readonly db = db;

  constructor() {}

  async findById(id: string): Promise<User | null> {
    const drizzleUsers = await db
      .select()
      .from(user)
      .where(eq(user.id, id))
      .limit(1)
      .execute();

    const drizzleUser = drizzleUsers[0];
    if (!drizzleUser) return null;

    const userEntity = new User({
      id: drizzleUser.id,
      email: drizzleUser.email,
      name: drizzleUser.name,
      emailVerified: drizzleUser.emailVerified,
      createdAt: drizzleUser.createdAt,
      updatedAt: drizzleUser.updatedAt,
    });
    return userEntity;
  }
}
