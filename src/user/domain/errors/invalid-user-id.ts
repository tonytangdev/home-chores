export class InvalidUserIdError extends Error {
  constructor(id: string | null | undefined) {
    const message =
      id === '' ? 'User id cannot be empty' : `Invalid user id: ${id}`;

    super(message);
  }
}
