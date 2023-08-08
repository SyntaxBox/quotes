import { User as PrismaUser } from '@prisma/client';
type User = PrismaUser;

type OptionalUser = {
  [K in keyof User]?: boolean;
};

export type UserFilter = Omit<OptionalUser, 'providerId'>;
export type UserId = Pick<User, 'id'>;
export type UserProviderId = Pick<User, 'providerId'>;
export type UserCredentials = Pick<User, 'email'>;

export type CreateUser = {
  data: Omit<User, 'id'>;
  select: UserFilter;
};

export type ValidUser = {
  where: UserId | UserProviderId | UserCredentials;
  select: UserFilter;
};

export type ValidUserViaId = {
  where: UserId;
  select: UserFilter;
};

export type ValidUserViaProviderId = {
  where: UserProviderId;
  select: UserFilter;
};

export type ValidUserViaCredentials = {
  where: UserCredentials;
  select: UserFilter;
};
