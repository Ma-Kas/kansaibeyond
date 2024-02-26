type User = {
  id: number;
  username: string;
  userIcon: string | null;
  password: string;
  status: 'Admin' | 'Writer' | 'Tech' | 'Guest';
  disabled: boolean;
  blogId: number[];
  commentId: number[];
};

type NewUser = Pick<User, 'username' | 'password'>;

export { NewUser };
