import { UserRepository } from '../ports/repositories/user.repository.port';
import { GetUserUseCase } from './get-user.use-case';
import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { User } from '../domain/user';
import { UserNotFoundError } from '../domain/errors/user-not-found.error';
import { InvalidUserIdError } from '../domain/errors/invalid-user-id';

describe('GetUserUseCase', () => {
  let useCase: GetUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;

  const userRepositoryMock: jest.Mocked<UserRepository> = {
    findById: jest.fn(),
  } as unknown as jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        GetUserUseCase,
        {
          provide: UserRepository,
          useValue: userRepositoryMock,
        },
      ],
    }).compile();

    useCase = moduleRef.get<GetUserUseCase>(GetUserUseCase);
    userRepository = moduleRef.get<jest.Mocked<UserRepository>>(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  it('should return a user', async () => {
    const userId = faker.string.uuid();
    const user = new User({
      id: userId,
      email: faker.internet.email(),
      emailVerified: faker.datatype.boolean(),
      name: faker.person.fullName(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    });

    userRepository.findById.mockResolvedValue(user);
    const result = await useCase.execute(userId);

    expect(result).toEqual(user);
  });

  it('should throw an error if user not found', async () => {
    const userId = faker.string.uuid();
    userRepository.findById.mockResolvedValue(null);
    await expect(useCase.execute(userId)).rejects.toThrow(UserNotFoundError);
  });

  it.each([{ id: undefined }, { id: null }, { id: '' }])(
    'should throw an error if id is invalid : $id',
    async ({ id }) => {
      await expect(useCase.execute(id)).rejects.toThrow(InvalidUserIdError);
    },
  );
});
