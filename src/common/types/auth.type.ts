import { User as PrismaUser } from '@prisma/client';
type User = PrismaUser;

export type UserFilter = {
  [K in keyof User]?: boolean;
};

export type CreateUser = {
  data: Pick<User, 'email' | 'password' | 'fname' | 'lname'>;
  select: UserFilter;
};

export type UserId = Pick<User, 'id'>;
export type userCredentials = Pick<User, 'email' | 'password'>;

export type ValidUserViaId = {
  where: UserId;
  select: UserFilter;
};

export type ValidUserViaCredentials = {
  where: userCredentials;
  select: UserFilter;
};

export type ValidUser = {
  where: UserId | userCredentials;
  select: UserFilter;
};
