import { Request, Response, NextFunction } from 'express';
import { Post, Category, User, Comment, Tag } from '../../models';
import { getSessionOrThrow } from '../../utils/get-session-or-throw';
import UnauthorizedError from '../../errors/UnauthorizedError';
import NotFoundError from '../../errors/NotFoundError';
import {
  hasAdminPermission,
  hasOwnerPermission,
  hasWriterPermission,
} from '../../utils/permission-group-handler';

const getUserRoleOfPost = (post: Post) => {
  if (
    'user' in post &&
    post.user &&
    typeof post.user === 'object' &&
    'role' in post.user &&
    typeof post.user.role === 'string'
  ) {
    return post.user.role;
  }
  return '';
};

export const get_one_post = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const session = getSessionOrThrow(req);

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
          attributes: {
            exclude: ['userId', 'categoryId', 'content', 'relatedPosts'],
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

    if (
      !hasOwnerPermission(session.role) &&
      hasOwnerPermission(getUserRoleOfPost(post))
    ) {
      throw new UnauthorizedError({ message: 'Unauthorized to access.' });
    }

    if (!hasWriterPermission(session.role)) {
      throw new UnauthorizedError({ message: 'Unauthorized to access.' });
    }

    if (!hasAdminPermission(session.role) && post.userId !== session.userId) {
      throw new UnauthorizedError({ message: 'Unauthorized to access.' });
    }
    res.status(200).json(post);
  } catch (err: unknown) {
    next(err);
  }
};
