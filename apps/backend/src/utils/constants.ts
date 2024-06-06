export const MIN_CATEGORIES_PER_POST = 1;
export const MAX_CATEGORIES_PER_POST = 3;
export const MIN_TAGS_PER_POST = 1;
export const MAX_TAGS_PER_POST = 10;
export const MAX_RELATED_POSTS = 3;

export const USER_ROLES = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  TECH: 'TECH',
  WRITER: 'WRITER',
  GUEST: 'GUEST',
} as const;

export const SELECTABLE_USER_ROLES = {
  ADMIN: 'ADMIN',
  TECH: 'TECH',
  WRITER: 'WRITER',
  GUEST: 'GUEST',
} as const;
