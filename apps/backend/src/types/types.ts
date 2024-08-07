import { USER_ROLES } from '../utils/constants';

////////////////////////////////////////////////////////////////////////////////
// Utility Types                                                              //
////////////////////////////////////////////////////////////////////////////////

type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

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
  role: UserRole;
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
  postData?: Partial<Omit<Post, 'id' | 'views' | 'userId'>>;
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

////////////////////////////////////////////////////////////////////////////////
// Social Media Reel Model Types                                              //
////////////////////////////////////////////////////////////////////////////////

type ReelData = {
  id: number;
  url: string;
  image: CoverImage;
};

type SocialMediaReel = {
  id: number;
  reelData: ReelData[];
};

type NewSocialMediaReel = Omit<SocialMediaReel, 'id'>;

type UpdateSocialMediaReel = {
  reelData: ReelData[];
};

export {
  Subset,
  UserRole,
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
  ReelData,
  SocialMediaReel,
  NewSocialMediaReel,
  UpdateSocialMediaReel,
};
