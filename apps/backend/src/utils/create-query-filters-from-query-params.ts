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

// Create filter for post query to account for optional query strings category, tag and user
// Always includes filter to limit post status to published
export const createDynamicWhere = (req: Request) => {
  const categoryQuery =
    req.query.category && typeof req.query.category === 'string' ? true : false;
  const tagQuery =
    req.query.tag && typeof req.query.tag === 'string' ? true : false;
  const userQuery =
    req.query.username && typeof req.query.username === 'string' ? true : false;

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
      ...(userQuery ? [{ '$user.username$': req.query.username }] : []),
    ],
  };

  return where;
};
