import { User } from '../../domain/user';

export abstract class UserRepository {
  abstract findById(id: string): Promise<User | null>;
  abstract updateUser(id: string, user: User): Promise<void>;
}
