import { Request, Response, NextFunction } from 'express';

import { Tag, Post } from '../../models';
import {
  validateNewTag,
  validateTagUpdate,
} from '../../utils/validate-tag-data';

import { MIN_TAGS_PER_POST } from '../../utils/constants';
import NotFoundError from '../../errors/NotFoundError';
import BadRequestError from '../../errors/BadRequestError';
import { sequelize } from '../../utils/db';

export const get_all_tags = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tags = await Tag.findAll({
      include: [
        {
          model: Post,
          attributes: ['id', 'postSlug'],
          through: {
            attributes: [],
          },
        },
      ],
      order: [['tagName', 'ASC']],
    });

    res.status(200).json(tags);
  } catch (err: unknown) {
    next(err);
  }
};

export const get_one_tag = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tag = await Tag.findOne({
      where: { tagSlug: req.params.tagSlug },
      include: [
        {
          model: Post,
          attributes: ['id', 'postSlug'],
          through: {
            attributes: [],
          },
        },
      ],
    });
    if (!tag) {
      throw new NotFoundError({ message: 'Tag not found.' });
    }
    res.status(200).json(tag);
  } catch (err: unknown) {
    next(err);
  }
};

export const post_new_tag = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newTag = validateNewTag(req.body);
    if (newTag) {
      const addedTag = await Tag.create(newTag);
      res.status(201).json(addedTag);
    } else {
      throw new BadRequestError({ message: 'Invalid Tag data.' });
    }
  } catch (err: unknown) {
    next(err);
  }
};

export const update_one_tag = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tagToUpdate = await Tag.findOne({
      where: { tagSlug: req.params.tagSlug },
    });
    if (!tagToUpdate) {
      throw new NotFoundError({ message: 'Tag to update was not found.' });
    }
    const tagUpdateData = validateTagUpdate(req.body);

    if (!tagUpdateData) {
      // No update data => return original tag
      res.status(204).send();
    } else {
      const updatedTag = await Tag.update(tagUpdateData, {
        where: { tagSlug: tagToUpdate.tagSlug },
        returning: true,
      });
      res.status(200).json(updatedTag[1][0]);
    }
  } catch (err: unknown) {
    next(err);
  }
};

export const delete_one_tag = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const transaction = await sequelize.transaction();
  try {
    const tagToDelete = await Tag.findOne({
      where: { tagSlug: req.params.tagSlug },
    });
    if (!tagToDelete) {
      throw new NotFoundError({ message: 'Tag to delete was not found.' });
    }

    const postCount = await tagToDelete.countPosts();

    // Tag is associated with posts, check for each affected post, if it has
    // other tags associated with it
    if (postCount) {
      const posts = await tagToDelete.getPosts();
      const blockingPosts = [];
      for (let i = 0; i < postCount; i++) {
        const tagCount = await posts[i].countTags();
        if (tagCount === MIN_TAGS_PER_POST) {
          blockingPosts.push(posts[i]);
        } else {
          await posts[i].removeTag(tagToDelete, {
            transaction: transaction,
          });
        }
      }
      // If tagToDelete is only tag for any post, block deletion,
      // list blockingPosts
      if (blockingPosts.length) {
        throw new BadRequestError({
          message: `Cannot delete. Tag is only tag in ${
            blockingPosts.length
          } posts. Affected posts: ${blockingPosts
            .map((post) => post.postSlug)
            .join(' | ')}`,
        });
      }
    }

    // Not associated posts that would block deletion
    await tagToDelete.destroy({
      transaction: transaction,
    });
    await transaction.commit();
    res.status(200).json({ message: `Deleted tag "${tagToDelete.tagName}"` });
  } catch (err: unknown) {
    await transaction.rollback();
    next(err);
  }
};
