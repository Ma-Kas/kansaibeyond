import { Request, Response, NextFunction } from 'express';

import { Tag, Post } from '../models';
import { validateNewTag, validateTagUpdate } from '../utils/validate-tag-data';
import NotFoundError from '../errors/NotFoundError';
import BadRequestError from '../errors/BadRequestError';

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
          through: {
            attributes: [],
          },
        },
      ],
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
    if (tagUpdateData) {
      const updatedTag = await Tag.update(tagUpdateData, {
        where: { tagSlug: tagToUpdate.tagSlug },
        returning: true,
      });
      res.status(200).json(updatedTag[1][0]);
    } else {
      // No update data => return original tag
      res.status(204).send();
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
  try {
    const tagToDelete = await Tag.findOne({
      where: { tagSlug: req.params.tagSlug },
    });
    if (!tagToDelete) {
      throw new NotFoundError({ message: 'Tag to delete was not found.' });
    }

    const postCount = await tagToDelete.countPosts();

    if (postCount) {
      throw new BadRequestError({
        message: `Cannot delete. Tag is used in ${postCount} posts.`,
      });
    }

    await tagToDelete.destroy();
    res.status(200).json({ message: `Deleted ${tagToDelete.tagName}` });
  } catch (err: unknown) {
    next(err);
  }
};
