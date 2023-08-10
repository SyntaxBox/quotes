import { User as PrismaUser } from '@prisma/client';
// dynamic user type depends on the prisma client user type
type User = PrismaUser;

// transforming the User type to optional boolean values
type OptionalUser = {
  [K in keyof User]?: boolean;
};

// other types are can be understood from it's name

export type UserFilter = Omit<OptionalUser, 'providerId'>;
export type UserId = Pick<User, 'id'>;
export type UserProviderId = Pick<User, 'providerId'>;
export type UserCredentials = Pick<User, 'email'>;
export type UserData = Omit<User, 'id'>;
export type SelectUser = UserId | UserProviderId | UserCredentials;

export type CreateUser = {
  data: UserData;
  select: UserFilter;
};

export type UpdateUser = {
  data: Partial<Omit<UserData, 'provider'>>;
  where: SelectUser;
  select: UserFilter;
};

export type ValidUser = {
  where: SelectUser;
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

export type deleteUser = {
  where: SelectUser;
};
