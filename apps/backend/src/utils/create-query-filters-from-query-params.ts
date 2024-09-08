import { Request } from 'express';
import { WhereOptions, InferAttributes, Op, Sequelize } from 'sequelize';
import { Post } from '../models';

// Creating conditional filters for post queries based on query string

// Limits the number of entries returned to the limit in the query string
// No limit if no query string present
export const createLimit = (req: Request) => {
  if (!req.query.limit || typeof req.query.limit !== 'string') {
    return undefined;
  }

  if (
    Number.isNaN(req.query.limit) ||
    !Number.isInteger(Number(req.query.limit))
  )
    return undefined;

  return Number(req.query.limit);
};

// Offsets the query by number of rows provided, to skip those x first entries
// Useful for pagination
export const createOffset = (req: Request) => {
  if (!req.query.offset || typeof req.query.offset !== 'string') {
    return undefined;
  }

  if (
    Number.isNaN(req.query.offset) ||
    !Number.isInteger(Number(req.query.offset))
  )
    return undefined;

  return Number(req.query.offset);
};

// Create filter for post query to account for optional query strings category, tag and user
// Always includes filter to limit post status to published
export const createDynamicWhere = (req: Request) => {
  const categoryQuery =
    req.query.category && typeof req.query.category === 'string' ? true : false;
  const tagQuery =
    req.query.tag && typeof req.query.tag === 'string' ? true : false;
  const userQuery =
    req.query.username && typeof req.query.username === 'string' ? true : false;
  const post_slugQuery =
    req.query.post_slug && typeof req.query.post_slug === 'string'
      ? true
      : false;

  const where: WhereOptions<InferAttributes<Post, { omit: never }>> = {
    [Op.and]: [
      { status: 'published' },
      ...(categoryQuery
        ? [
            {
              id: [
                Sequelize.literal(
                  `(SELECT pc2.post_id FROM posts_categories AS pc2 
                  JOIN categories AS c2 ON pc2.category_id = c2.id 
                  WHERE c2.category_slug =:categoryReplacement)`
                ),
              ],
            },
          ]
        : []),
      ...(tagQuery
        ? [
            {
              id: [
                Sequelize.literal(
                  `(SELECT pt2.post_id FROM posts_tags AS pt2 
                  JOIN tags AS t2 ON pt2.tag_id = t2.id 
                  WHERE t2.tag_slug = :tagReplacement)`
                ),
              ],
            },
          ]
        : []),
      ...(userQuery
        ? [
            {
              id: [
                Sequelize.literal(
                  `(SELECT pst.id FROM posts AS pst 
                    JOIN users AS usr ON pst.user_id = usr.id 
                    WHERE usr.username = :userReplacement)`
                ),
              ],
            },
          ]
        : []),
      ...(post_slugQuery ? [{ postSlug: req.query.post_slug as string }] : []),
    ],
  };

  return where;
};

// Create filter for post query to account for search query string
// Searches post title, postSlug, categories, and tags
// Always includes filter to limit post status to published
export const createSearchWhere = (req: Request) => {
  const hasSearchQuery =
    req.query.q && typeof req.query.q === 'string' ? true : false;

  const searchQuery = {
    [Op.or]: [
      {
        title: {
          [Op.iLike]: `%${req.query.q}%`,
        },
      },
      {
        postSlug: {
          [Op.iLike]: `%${req.query.q}%`,
        },
      },
      {
        id: {
          [Op.or]: [
            [
              Sequelize.literal(
                `(SELECT pc2.post_id FROM posts_categories AS pc2
                JOIN categories AS c2 ON pc2.category_id = c2.id
                WHERE c2.category_name ILIKE :categoryReplacement)`
              ),
            ],
            [
              Sequelize.literal(
                `(SELECT pt2.post_id FROM posts_tags AS pt2
                JOIN tags AS t2 ON pt2.tag_id = t2.id
                WHERE t2.tag_name ILIKE :tagReplacement)`
              ),
            ],
          ],
        },
      },
    ],
  };

  const where: WhereOptions<InferAttributes<Post, { omit: never }>> = {
    [Op.and]: [
      { status: 'published' },
      ...(hasSearchQuery ? [searchQuery] : []),
    ],
  };

  return where;
};
