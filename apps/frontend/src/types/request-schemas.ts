import { z } from 'zod';
import { USER_ROLES } from '@/config/constants';

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

const userSchema = z
  .object({
    username: z.string(),
    displayName: z.string(),
    userIcon: z.string().nullable(),
    role: userRoleSchema,
  })
  .strict();

const imageSchema = z
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

////////////////////////////////////////////////////////////////////////////////
////////////////             CATEGORY SCHEMAS                    ///////////////
////////////////////////////////////////////////////////////////////////////////

const categorySchema = z
  .object({
    id: z.number(),
    categoryName: z.string(),
    categorySlug: z.string(),
    description: z.string().nullable(),
    coverImage: imageSchema.nullable(),
    posts: z.array(tagCategoryPostSchema),
  })
  .strict();

export const allCategoriesSchema = z.array(categorySchema);
export const singleCategorySchema = categorySchema.omit({ posts: true });

////////////////////////////////////////////////////////////////////////////////
//////////////////             TAGS SCHEMAS                    /////////////////
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

////////////////////////////////////////////////////////////////////////////////
//////////////////             POST SCHEMAS                    /////////////////
////////////////////////////////////////////////////////////////////////////////

const postStatusSchema = z.union([
  z.literal('published'),
  z.literal('draft'),
  z.literal('pending'),
  z.literal('trash'),
]);

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

const relatedPostSchema = z
  .object({
    id: z.number(),
    postSlug: z.string(),
    title: z.string(),
    coverImage: imageSchema.nullable(),
    status: postStatusSchema,
    views: z.number(),
    readTime: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
    deletedAt: z.string().nullable(),
    user: userSchema,
    categories: z.array(postCategorySchema),
    tags: z.array(postTagSchema),
  })
  .strict();

export const postSchema = z
  .object({
    id: z.number(),
    postSlug: z.string(),
    title: z.string(),
    content: z.string(),
    coverImage: imageSchema.nullable(),
    status: postStatusSchema,
    views: z.number(),
    readTime: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
    deletedAt: z.string().nullable(),
    user: userSchema,
    relatedPosts: z.array(relatedPostSchema).optional(),
    categories: z.array(postCategorySchema),
    tags: z.array(postTagSchema),
    comments: z.array(postCommentSchema).optional(),
  })
  .strict();

const listPostSchema = postSchema.omit({ content: true });
export const postSlugListSchema = z.array(
  z.object({ postSlug: z.string() }).strict()
);

export const allPostsSchema = z
  .object({ rows: z.array(listPostSchema), count: z.number() })
  .strict();

////////////////////////////////////////////////////////////////////////////////
///////////////             AFFILIATE SCHEMAS                    ///////////////
////////////////////////////////////////////////////////////////////////////////

const affiliateSchema = z
  .object({
    id: z.number(),
    blogName: z.string(),
    blogUrl: z.string(),
    blogDescription: z.string(),
    user: userSchema.nullable(),
  })
  .strict();

export const allAffiliatesSchema = z.array(affiliateSchema);

////////////////////////////////////////////////////////////////////////////////
///////////////                USER PAGE SCHEMAS                 ///////////////
////////////////////////////////////////////////////////////////////////////////

const userAffiliateSchema = z
  .object({
    blogName: z.string(),
    blogUrl: z.string(),
    blogDescription: z.string(),
  })
  .strict();

const userContactSchema = z
  .object({
    email: z.string().nullable(),
    homepage: z.string().nullable(),
    twitter: z.string().nullable(),
    instagram: z.string().nullable(),
    youtube: z.string().nullable(),
    linkedin: z.string().nullable(),
  })
  .strict();

export const publicUserSchema = z
  .object({
    username: z.string(),
    displayName: z.string(),
    userIcon: z.string().nullable(),
    introduction: z.string(),
    role: userRoleSchema,
    contact: userContactSchema,
    affiliate: userAffiliateSchema.nullable(),
  })
  .strict();

export const allPublicUsersSchema = z.array(publicUserSchema);

////////////////////////////////////////////////////////////////////////////////
///////////             SOCIAL MEDIA REEL SCHEMAS                    ///////////
////////////////////////////////////////////////////////////////////////////////
const reelDataSchema = z
  .object({
    id: z.number(),
    url: z.string(),
    image: imageSchema,
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
//////////////             REVALIDATION SCHEMAS                    /////////////
////////////////////////////////////////////////////////////////////////////////

export const revalidateTagSchema = z
  .object({
    tag: z.string(),
    secret: z.string(),
  })
  .strict();

////////////////////////////////////////////////////////////////////////////////
///////////////////             TYPES                    ///////////////////////
////////////////////////////////////////////////////////////////////////////////

export type Category = z.infer<typeof categorySchema>;
export type Tag = z.infer<typeof tagSchema>;
export type Post = z.infer<typeof postSchema>;
export type PostForList = z.infer<typeof listPostSchema>;
export type PostUser = z.infer<typeof userSchema>;
export type SocialMediaReelType = z.infer<typeof socialMediaReelSchema>;
export type Affiliate = z.infer<typeof affiliateSchema>;
