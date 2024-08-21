import { z } from 'zod';
import { USER_ROLES } from '../config/constants';

////////////////////////////////////////////////////////////////////////////////
/////////////////             COMMON SCHEMAS                    ////////////////
////////////////////////////////////////////////////////////////////////////////

const userRoleSchema = z.union([
  z.literal(USER_ROLES.OWNER),
  z.literal(USER_ROLES.ADMIN),
  z.literal(USER_ROLES.TECH),
  z.literal(USER_ROLES.WRITER),
  z.literal(USER_ROLES.GUEST),
]);

const coverImageSchema = z
  .object({
    altText: z.string(),
    urlSlug: z.string(),
  })
  .strict();

const tagCategoryPostSchema = z
  .object({
    id: z.number(),
    postSlug: z.string(),
  })
  .strict();

export const deleteOneSchema = z
  .object({
    message: z.string(),
  })
  .strict();

////////////////////////////////////////////////////////////////////////////////
/////////////////             CATEGORY SCHEMAS                  ////////////////
////////////////////////////////////////////////////////////////////////////////

export const categorySchema = z
  .object({
    id: z.number(),
    categoryName: z.string(),
    categorySlug: z.string(),
    description: z.string().nullable(),
    coverImage: coverImageSchema.nullable(),
    posts: z.array(tagCategoryPostSchema),
  })
  .strict();

export const allCategoriesSchema = z.array(categorySchema);

export const newUpdateCategorySchema = categorySchema.omit({ posts: true });

////////////////////////////////////////////////////////////////////////////////
/////////////////                TAG SCHEMAS                    ////////////////
////////////////////////////////////////////////////////////////////////////////

export const tagSchema = z
  .object({
    id: z.number(),
    tagName: z.string(),
    tagSlug: z.string(),
    posts: z.array(tagCategoryPostSchema),
  })
  .strict();

export const allTagsSchema = z.array(tagSchema);

export const newUpdateTagSchema = tagSchema.omit({ posts: true });

////////////////////////////////////////////////////////////////////////////////
/////////////////               POST SCHEMAS                    ////////////////
////////////////////////////////////////////////////////////////////////////////

const postStatusSchema = z.union([
  z.literal('published'),
  z.literal('draft'),
  z.literal('pending'),
  z.literal('trash'),
]);

const postUserSchema = z
  .object({
    username: z.string(),
    displayName: z.string(),
    userIcon: z.string().nullable(),
    role: z.string(),
  })
  .strict();

const postRelatedSchema = z
  .object({
    id: z.number(),
    title: z.string(),
  })
  .strict();

const postCategorySchema = z
  .object({
    id: z.number(),
    categoryName: z.string(),
    categorySlug: z.string(),
  })
  .strict();

const postTagSchema = z
  .object({
    id: z.number(),
    tagName: z.string(),
    tagSlug: z.string(),
  })
  .strict();

const postCommentSchema = z
  .object({
    id: z.number(),
    content: z.string(),
    name: z.string().nullable(),
    user: z
      .object({
        username: z.string(),
      })
      .strict()
      .nullable(),
  })
  .strict();

export const getPostSchema = z
  .object({
    id: z.number(),
    postSlug: z.string(),
    title: z.string(),
    content: z.string().optional(),
    coverImage: coverImageSchema.nullable(),
    status: postStatusSchema,
    views: z.number(),
    readTime: z.number(),
    updatedAt: z.string(),
    deletedAt: z.string().nullable(),
    user: postUserSchema,
    userId: z.number().optional(),
    relatedPosts: z.array(postRelatedSchema).optional(),
    categories: z.array(postCategorySchema),
    tags: z.array(postTagSchema),
    comments: z.array(postCommentSchema),
  })
  .strict();

export type Post = z.infer<typeof getPostSchema>;

export const getAllPostsSchema = z.array(getPostSchema);

export const newUpdatePostSchema = z
  .object({
    id: z.number(),
    postSlug: z.string(),
    title: z.string(),
    content: z.string(),
    coverImage: coverImageSchema.nullable(),
    status: postStatusSchema,
    views: z.number(),
    readTime: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
    deletedAt: z.string().nullable(),
    userId: z.number(),
  })
  .strict();

////////////////////////////////////////////////////////////////////////////////
/////////////////               USER SCHEMAS                    ////////////////
////////////////////////////////////////////////////////////////////////////////

const userPostSchema = z
  .object({
    id: z.number(),
    postSlug: z.string(),
    title: z.string(),
    content: z.string().optional(),
    coverImage: coverImageSchema.nullable(),
    status: postStatusSchema,
    views: z.number(),
    readTime: z.number(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    deletedAt: z.string().nullable(),
    userId: z.number().optional(),
  })
  .strict();

const commentUserSchema = z
  .object({
    displayName: z.string(),
    userIcon: z.string().nullable(),
    role: userRoleSchema,
  })
  .strict();

const commentPostSchema = z
  .object({
    id: z.number(),
    postSlug: z.string(),
  })
  .strict();

const userCommentSchema = z
  .object({
    id: z.number(),
    content: z.string(),
    name: z.string().nullable(),
    email: z.string().email().nullable(),
    user: commentUserSchema,
    post: commentPostSchema,
  })
  .strict();

const userContactSchema = z
  .object({
    id: z.number(),
    email: z.string().email().nullable(),
    homepage: z.string().nullable(),
    twitter: z.string().nullable(),
    instagram: z.string().nullable(),
    youtube: z.string().nullable(),
    linkedin: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
    userId: z.number(),
  })
  .strict();

export const userSchema = z
  .object({
    id: z.number(),
    username: z.string(),
    email: z.string(),
    displayName: z.string(),
    password: z.string(),
    userIcon: z.string().nullable(),
    firstName: z.string(),
    lastName: z.string(),
    introduction: z.string().nullable(),
    role: userRoleSchema,
    disabled: z.boolean(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    deletedAt: z.string().nullable(),
    posts: z.array(userPostSchema),
    comments: z.array(userCommentSchema),
    contact: userContactSchema,
  })
  .strict();

export type User = z.infer<typeof userSchema>;

export const newUpdateUserSchema = userSchema.omit({
  posts: true,
  comments: true,
  contact: true,
});

export const allUsersSchema = z.array(userSchema);

////////////////////////////////////////////////////////////////////////////////
/////////////////               AUTH SCHEMAS                    ////////////////
////////////////////////////////////////////////////////////////////////////////

export const authSchema = z
  .object({
    id: z.number(),
    username: z.string(),
    displayName: z.string(),
    userIcon: z.string().nullable(),
    role: z.string(),
  })
  .strict()
  .nullable();

////////////////////////////////////////////////////////////////////////////////
/////////////////           SOCIAL MEDIA REEL SCHEMAS           ////////////////
////////////////////////////////////////////////////////////////////////////////

const reelImageSchema = z.object({
  urlSlug: z.string(),
  altText: z.string(),
});

const reelDataSchema = z
  .object({
    id: z.number(),
    url: z.string(),
    image: reelImageSchema,
  })
  .strict();

export const socialMediaReelSchema = z
  .object({
    id: z.number(),
    reelData: z.array(reelDataSchema),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .strict();

////////////////////////////////////////////////////////////////////////////////
/////////////////             AFFILIATE SCHEMAS                   //////////////
////////////////////////////////////////////////////////////////////////////////

const affiliateUserSchema = z
  .object({
    username: z.string(),
    displayName: z.string(),
    userIcon: z.string().nullable(),
    role: userRoleSchema,
  })
  .strict();

export const affiliateSchema = z
  .object({
    id: z.number(),
    blogName: z.string(),
    blogUrl: z.string().url(),
    blogDescription: z.string(),
    userId: z.number().nullable().optional(),
    user: affiliateUserSchema.optional().nullable(),
  })
  .strict();

export type Affiliate = z.infer<typeof affiliateSchema>;

export const allAffiliatesSchema = z.array(affiliateSchema);

export const newUpdateAffiliateSchema = affiliateSchema;

////////////////////////////////////////////////////////////////////////////////
/////////////////             REVALIDATION SCHEMAS                //////////////
////////////////////////////////////////////////////////////////////////////////

export const revalidationResultSchema = z
  .object({
    revalidated: z.string(),
    now: z.string(),
  })
  .strict();
