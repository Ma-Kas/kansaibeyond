import { Request, Response, NextFunction } from 'express';
import { WhereOptions, InferAttributes } from 'sequelize';
import { Post, Category, User, Comment, Tag } from '../../models';

import NotFoundError from '../../errors/NotFoundError';

// Creating conditional where filters for post queries based on query string
const createCategoryWhere = (req: Request) => {
  let where: WhereOptions<InferAttributes<Category, { omit: never }>> = {};

  if (req.query.category && typeof req.query.category === 'string') {
    where = {
      categorySlug: req.query.category,
    };
  }

  return where;
};
const createTagWhere = (req: Request) => {
  let where: WhereOptions<InferAttributes<Tag, { omit: never }>> = {};

  if (req.query.tag && typeof req.query.tag === 'string') {
    where = {
      tagSlug: req.query.tag,
    };
  }

  return where;
};

export const get_all_posts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const categoryWhere = createCategoryWhere(req);
  const tagWhere = createTagWhere(req);
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
          where: categoryWhere,
        },
        {
          model: Tag,
          attributes: ['id', 'tagName', 'tagSlug'],
          through: {
            attributes: [],
          },
          where: tagWhere,
        },
        {
          model: Comment,
          attributes: ['id'],
        },
      ],
      where: { status: 'published' },
      order: [['createdAt', 'DESC']],
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
      where: { postSlug: req.params.postSlug },
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
