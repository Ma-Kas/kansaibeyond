import { Request, Response, NextFunction } from 'express';
import { WhereOptions, InferAttributes, Op, Sequelize } from 'sequelize';
import { Post, Category, User, Comment, Tag } from '../../models';

import NotFoundError from '../../errors/NotFoundError';

// Creating conditional where filters for post queries based on query string
// const createCategoryWhere = (req: Request) => {
//   let where: WhereOptions<InferAttributes<Category, { omit: never }>> = {};

//   if (req.query.category && typeof req.query.category === 'string') {
//     where = {
//       categorySlug: req.query.category,
//     };
//   }

//   return where;
// };
// const createTagWhere = (req: Request) => {
//   let where: WhereOptions<InferAttributes<Tag, { omit: never }>> = {};

//   if (req.query.tag && typeof req.query.tag === 'string') {
//     where = {
//       tagSlug: req.query.tag,
//     };
//   }

//   return where;
// };
// const createUserWhere = (req: Request) => {
//   let where: WhereOptions<InferAttributes<User, { omit: never }>> = {};

//   if (req.query.username && typeof req.query.username === 'string') {
//     where = {
//       username: req.query.username,
//     };
//   }

//   return where;
// };
const createLimit = (req: Request) => {
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
// const createExperimentalWhere = (req: Request) => {
//   const categoryQuery =
//     req.query.category && typeof req.query.category === 'string' ? true : false;
//   const tagQuery =
//     req.query.tag && typeof req.query.tag === 'string' ? true : false;
//   const userQuery =
//     req.query.username && typeof req.query.username === 'string' ? true : false;

//   const where: WhereOptions<InferAttributes<Post, { omit: never }>> = {
//     [Op.and]: [
//       { status: 'published' },
//       ...(categoryQuery
//         ? [{ '$categories.category_slug$': req.query.category }]
//         : []),
//       ...(tagQuery ? [{ '$tags.tag_slug$': req.query.tag }] : []),
//       ...(userQuery ? [{ '$user.username$': req.query.username }] : []),
//     ],
//   };

//   return where;
// };

const createExperimentalWhere = (req: Request) => {
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
                  `(SELECT pc2.post_id FROM posts_categories pc2 JOIN categories c2 ON pc2.category_id = c2.id WHERE c2.category_slug = '${req.query.category}')`
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
                  `(SELECT pt2.post_id FROM posts_tags pt2 JOIN tags t2 ON pt2.tag_id = t2.id WHERE t2.tag_slug = '${req.query.tag}')`
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

export const get_all_posts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const experimentalWhere = createExperimentalWhere(req);
  const postLimit = createLimit(req);

  try {
    const allPosts = await Post.findAll({
      attributes: {
        exclude: ['userId', 'categoryId', 'content'],
      },

      include: [
        {
          model: User,
          attributes: ['username', 'displayName', 'userIcon', 'role'],
        },

        {
          model: Category,
          attributes: ['id', 'categoryName', 'categorySlug'],
          through: {
            attributes: [],
          },
        },
        {
          model: Tag,
          attributes: ['id', 'tagName', 'tagSlug'],
          through: {
            attributes: [],
          },
        },
        {
          model: Comment,
          attributes: ['id'],
        },
      ],

      where: experimentalWhere,
      limit: postLimit,
      order: [['updatedAt', 'DESC']],
    });

    if (!allPosts) {
      throw new NotFoundError({ message: 'No posts found' });
    }

    res.status(200).json(allPosts);
  } catch (err: unknown) {
    next(err);
  }
};

export const get_one_post = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await Post.findOne({
      where: {
        [Op.and]: [{ postSlug: req.params.postSlug }, { status: 'published' }],
      },
      attributes: {
        exclude: ['userId', 'categoryId'],
      },
      include: [
        {
          model: User,
          attributes: ['username', 'displayName', 'userIcon', 'role'],
        },
        {
          model: Post,
          as: 'relatedPosts',
          attributes: ['id', 'title'],
          include: [
            {
              model: User,
              attributes: ['username', 'displayName', 'userIcon', 'role'],
            },
            {
              model: Category,
              attributes: ['id', 'categoryName', 'categorySlug'],
              through: {
                attributes: [],
              },
            },
            {
              model: Tag,
              attributes: ['id', 'tagName', 'tagSlug'],
              through: {
                attributes: [],
              },
            },
          ],
          through: {
            attributes: [],
          },
        },
        {
          model: Category,
          attributes: ['id', 'categoryName', 'categorySlug'],
          through: {
            attributes: [],
          },
        },
        {
          model: Tag,
          attributes: ['id', 'tagName', 'tagSlug'],
          through: {
            attributes: [],
          },
        },
        {
          model: Comment,
          attributes: ['id', 'content', 'name'],
          include: [
            {
              model: User,
              attributes: ['username'],
            },
          ],
        },
      ],
    });
    if (!post) {
      throw new NotFoundError({ message: 'Post not found.' });
    }
    res.status(200).json(post);
  } catch (err: unknown) {
    next(err);
  }
};
