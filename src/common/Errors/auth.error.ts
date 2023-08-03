export enum InvalidUserError {
  NOT_FOUND = 'Not Found',
  WRONG_PASSWORD = 'Wrong Password',
  BCRYPT_ERROR = 'Password Unknown Error',
}

export enum CreateUserError {
  BCRYPT_ERROR = 'Password Unknown Error',
  PRISMA_ERROR = 'user Did not create',
}

type AllowedErrorMessages = InvalidUserError | CreateUserError;

export class AuthError extends Error {
  constructor(message: AllowedErrorMessages) {
    super(message);
    this.name = 'CustomError';
  }
}
