import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUserUseCase } from './update-user.use-case';
import { InvalidUserIdError } from '../domain/errors/invalid-user-id';
import { UserRepository } from '../ports/repositories/user.repository.port';
import { faker } from '@faker-js/faker';
import { UserNotFoundError } from '../domain/errors/user-not-found.error';
import { User } from '../domain/user';

describe('UpdateUserUseCase', () => {
  let updateUserUseCase: UpdateUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;

  const userRepositoryMock = {
    findById: jest.fn(),
    updateUser: jest.fn(),
  } as unknown as jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserUseCase,
        {
          provide: UserRepository,
          useValue: userRepositoryMock,
        },
      ],
    }).compile();

    updateUserUseCase = module.get<UpdateUserUseCase>(UpdateUserUseCase);
    userRepository = userRepositoryMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(updateUserUseCase).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  it.each([
    {
      id: null,
    },
    {
      id: undefined,
    },
    {
      id: '',
    },
  ])('should throw an error if id is invalid : $id', async ({ id }) => {
    await expect(
      updateUserUseCase.execute(id, { name: faker.person.fullName() }),
    ).rejects.toThrow(InvalidUserIdError);
  });

  it('should throw an error if user does not exist', async () => {
    const id = faker.string.uuid();
    userRepository.findById.mockResolvedValue(null);
    await expect(
      updateUserUseCase.execute(id, { name: faker.person.fullName() }),
    ).rejects.toThrow(UserNotFoundError);
  });

  it('should update user', async () => {
    const id = faker.string.uuid();
    const user = new User({
      id,
      email: faker.internet.email(),
      name: faker.person.fullName(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      emailVerified: faker.datatype.boolean(),
    });
    const newName = faker.person.fullName();

    userRepository.findById.mockResolvedValue(user);
    await updateUserUseCase.execute(id, { name: newName });

    expect(userRepository.updateUser).toHaveBeenCalledWith(
      id,
      expect.objectContaining({
        name: newName,
      }),
    );
  });
});
