type User = {
  id: number;
  username: string;
  userIcon: string | null;
  firstName: string;
  lastName: string;
  email: string;
  displayName: string;
  password: string;
  status: 'Admin' | 'Writer' | 'Tech' | 'Guest';
  disabled: boolean;
  blogId?: number[];
  commentId?: number[];
};

type NewUser = Pick<
  User,
  'username' | 'firstName' | 'lastName' | 'email' | 'displayName' | 'password'
>;

// Omit original userIcon, re-add in intersection to disallow null when updating
type UpdateUser = Partial<
  Omit<User, 'id' | 'userIcon' | 'status' | 'disabled' | 'blogId' | 'commentId'>
> & { userIcon?: string };

export { User, NewUser, UpdateUser };
