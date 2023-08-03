export type User = {
  id: string;
  createdAt: string;
  updatedAt: string;
  fname: string;
  lname: string;
  email: string;
  password: string;
};

export type UserFilter = {
  [K in keyof User]?: boolean;
};

export type CreateUser = {
  data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
  select: UserFilter;
};
export type validUser = {
  where: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'fname' | 'lname'>;
  select: UserFilter;
};
