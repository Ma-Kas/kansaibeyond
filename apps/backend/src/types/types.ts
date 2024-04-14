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
type PostStatus = 'published' | 'draft' | 'pending' | 'trash';

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
  status?: PostStatus;
  views?: number;
  readTime?: number;
  userId: number;
};

type NewPostRequestData = Omit<Post, 'id' | 'views' | 'readTime'> & {
  categories: number[];
  tags: number[];
};

type NewPostValidationResult = {
  postData: Omit<Post, 'id' | 'views' | 'readTime' | 'userId'>;
  categories: number[];
  tags: number[];
};

type NewPost = Omit<Post, 'id' | 'views' | 'readTime'>;

type UpdatePost = Partial<Omit<NewPostRequestData, 'userId'>>;

// Category Model Types
type Category = {
  id: number;
  categoryName: string;
};

type CategoryExId = Omit<Category, 'id'>;

// Tag Model Types
type Tag = {
  id: number;
  tagName: string;
  tagSlug: string;
};

type NewTag = Omit<Tag, 'id'>;

type UpdateTag = Partial<NewTag>;

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
  PostStatus,
  NewPostRequestData,
  NewPostValidationResult,
  NewPost,
  UpdatePost,
  Category,
  CategoryExId,
  Tag,
  NewTag,
  UpdateTag,
  Comment,
  NewComment,
  NewRegisteredComment,
};
