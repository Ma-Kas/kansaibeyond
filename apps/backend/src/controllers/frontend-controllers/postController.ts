import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import { Post, Category, User, Comment, Tag } from '../../models';
import {
  createDynamicWhere,
  createLimit,
  createSearchWhere,
} from '../../utils/create-query-filters-from-query-params';

import NotFoundError from '../../errors/NotFoundError';

export const get_multiple_posts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const dynamicWhere = createDynamicWhere(req);
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

      where: dynamicWhere,
      replacements: {
        categoryReplacement: req.query.category,
        tagReplacement: req.query.tag,
      },
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

export const get_search_posts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const searchWhere = createSearchWhere(req);

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

      where: searchWhere,
      replacements: {
        categoryReplacement: `%${req.query.q}%`,
        tagReplacement: `%${req.query.q}%`,
      },
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
