import { User } from '../../domain/user';

export abstract class UserRepository {
  abstract findById(id: string): Promise<User | null>;
}
