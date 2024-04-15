// Contact Model Types
type Contact = {
  id: number;
  email?: string | null;
  homepage?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  youtube?: string | null;
  linkedin?: string | null;
};

// User Model Types
type User = {
  id: number;
  username: string;
  email: string;
  displayName: string;
  password: string;
  userIcon: string | null;
  firstName: string;
  lastName: string;
  introduction?: string;
  status: 'Admin' | 'Writer' | 'Tech' | 'Guest';
  disabled: boolean;
};

type NewUser = Pick<
  User,
  'username' | 'email' | 'displayName' | 'password' | 'firstName' | 'lastName'
>;

// Omit original userIcon, re-add in intersection to disallow null when updating
type UpdateUser = Partial<
  Omit<User, 'id' | 'userIcon' | 'status' | 'disabled'>
> & { userIcon?: string; contact?: Omit<Contact, 'id'> };

// Post Model Types
type PostStatus = 'published' | 'draft' | 'pending' | 'trash';

type CoverImage = {
  urlSlug: string;
  altText: string;
};

type Post = {
  id: number;
  postSlug: string;
  title: string;
  content: string;
  coverImage?: CoverImage;
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
