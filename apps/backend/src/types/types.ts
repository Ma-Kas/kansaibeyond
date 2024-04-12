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
  posts?: number[];
  comments?: number[];
};

type NewUser = Pick<
  User,
  'username' | 'firstName' | 'lastName' | 'email' | 'displayName' | 'password'
>;

// Omit original userIcon, re-add in intersection to disallow null when updating
type UpdateUser = Partial<
  Omit<User, 'id' | 'userIcon' | 'status' | 'disabled' | 'posts' | 'comments'>
> & { userIcon?: string };

// Post Model Types
type PostMedia = {
  name: string;
  url: string;
  caption?: string;
};

type Post = {
  id: number;
  postSlug: string;
  title: string;
  content: string;
  media: PostMedia;
  tags: string[];
  views?: number;
  readTime?: number;
  userId: number;
};

type NewPost = Omit<Post, 'id' | 'views' | 'readTime'> & {
  categories: number[];
};

type UpdatePost = Partial<Omit<NewPost, 'userId'>>;

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
  postId: number;
};

type NewComment = Pick<Comment, 'content' | 'postId'> & {
  name: string;
  email: string;
};

type NewRegisteredComment = Pick<Comment, 'content' | 'postId'> & {
  userId: number;
};

export {
  User,
  NewUser,
  UpdateUser,
  Post,
  NewPost,
  UpdatePost,
  Category,
  CategoryExId,
  Comment,
  NewComment,
  NewRegisteredComment,
};
