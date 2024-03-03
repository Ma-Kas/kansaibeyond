// User Model Types
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
  blogs?: number[];
  comments?: number[];
};

type NewUser = Pick<
  User,
  'username' | 'firstName' | 'lastName' | 'email' | 'displayName' | 'password'
>;

// Omit original userIcon, re-add in intersection to disallow null when updating
type UpdateUser = Partial<
  Omit<User, 'id' | 'userIcon' | 'status' | 'disabled' | 'blogs' | 'comments'>
> & { userIcon?: string };

// Blog Model Types
type BlogMedia = {
  name: string;
  url: string;
  caption?: string;
};

type Blog = {
  id: number;
  routeName: string;
  title: string;
  content: string;
  media: BlogMedia;
  tags: string[];
  views?: number;
  readTime?: number;
  userId: number;
  categoryId: number;
};

type NewBlog = Omit<Blog, 'id' | 'views' | 'readTime'>;

type UpdateBlog = Partial<Omit<NewBlog, 'userId'>>;

// Category Model Types
type Category = {
  id: number;
  categoryName: string;
};

type CategoryExId = Omit<Category, 'id'>;

// Comment Model Types
type Comment = {
  id: number;
  content: string;
  name?: string;
  email?: string;
  userId?: number;
  blogId: number;
};

type NewComment = Pick<Comment, 'content' | 'blogId'> & {
  name: string;
  email: string;
};

type NewRegisteredComment = Pick<Comment, 'content' | 'blogId'> & {
  userId: number;
};

export {
  User,
  NewUser,
  UpdateUser,
  Blog,
  NewBlog,
  UpdateBlog,
  Category,
  CategoryExId,
  Comment,
  NewComment,
  NewRegisteredComment,
};
