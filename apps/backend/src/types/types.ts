////////////////////////////////////////////////////////////////////////////////
// Utility Types                                                              //
////////////////////////////////////////////////////////////////////////////////

type UserStatus = 'Admin' | 'Writer' | 'Tech' | 'Guest';

type CoverImage = {
  urlSlug: string;
  altText: string;
};

// Utility type that works as a nested Partial
type Subset<K> = {
  [attr in keyof K]?: K[attr] extends object
    ? Subset<K[attr]>
    : K[attr] extends object | null
    ? Subset<K[attr]> | null
    : K[attr] extends object | null | undefined
    ? Subset<K[attr]> | null | undefined
    : K[attr];
};

type TokenType = {
  id: number;
  username: string;
  displayName: string;
  status: UserStatus;
};

////////////////////////////////////////////////////////////////////////////////
// Contact Model Types                                                        //
////////////////////////////////////////////////////////////////////////////////

type Contact = {
  id: number;
  email?: string | null;
  homepage?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  youtube?: string | null;
  linkedin?: string | null;
};

////////////////////////////////////////////////////////////////////////////////
// User Model Types                                                           //
////////////////////////////////////////////////////////////////////////////////

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
  status: UserStatus;
  disabled: boolean;
};

type NewUser = Pick<
  User,
  'username' | 'email' | 'displayName' | 'password' | 'firstName' | 'lastName'
>;

// Omit original userIcon, re-add in intersection to disallow null when updating
type UpdateUser = Partial<Omit<User, 'id' | 'userIcon'>> & {
  userIcon?: string;
  contact?: Omit<Contact, 'id'>;
};

////////////////////////////////////////////////////////////////////////////////
// Post Model Types                                                           //
////////////////////////////////////////////////////////////////////////////////

type PostStatus = 'published' | 'draft' | 'pending' | 'trash';

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

type NewPostRequestData = Omit<Post, 'id' | 'views' | 'readTime' | 'userId'> & {
  categories: number[];
  tags: number[];
  relatedPosts?: number[];
};

type NewPostValidationResult = {
  postData: Omit<Post, 'id' | 'views' | 'readTime' | 'userId'>;
  categories: number[];
  tags: number[];
  relatedPosts?: number[];
};

type NewPost = Omit<Post, 'id' | 'views' | 'readTime'>;

type UpdatePost = {
  postData?: Partial<Omit<Post, 'id' | 'views' | 'readTime' | 'userId'>>;
  categories?: number[];
  tags?: number[];
  relatedPosts?: number[];
};

////////////////////////////////////////////////////////////////////////////////
// Category Model Types                                                       //
////////////////////////////////////////////////////////////////////////////////

type Category = {
  id: number;
  categoryName: string;
  categorySlug: string;
  description?: string;
  coverImage?: CoverImage;
};

type NewCategory = Omit<Category, 'id'>;

type UpdateCategory = Partial<NewCategory>;

////////////////////////////////////////////////////////////////////////////////
// Tag Model Types                                                            //
////////////////////////////////////////////////////////////////////////////////

type Tag = {
  id: number;
  tagName: string;
  tagSlug: string;
};

type NewTag = Omit<Tag, 'id'>;

type UpdateTag = Partial<NewTag>;

////////////////////////////////////////////////////////////////////////////////
// Comment Model Types                                                        //
////////////////////////////////////////////////////////////////////////////////

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

////////////////////////////////////////////////////////////////////////////////
// Affiliate Model Types                                                      //
////////////////////////////////////////////////////////////////////////////////

type Affiliate = {
  id: number;
  blogName: string;
  blogUrl: string;
  blogDescription: string;
  userId?: number | null;
};

type NewAffiliate = Omit<Affiliate, 'id'>;

type UpdateAffiliate = Partial<NewAffiliate>;

export {
  Subset,
  UserStatus,
  TokenType,
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
  NewCategory,
  UpdateCategory,
  Tag,
  NewTag,
  UpdateTag,
  Comment,
  NewComment,
  NewRegisteredComment,
  Affiliate,
  NewAffiliate,
  UpdateAffiliate,
};
