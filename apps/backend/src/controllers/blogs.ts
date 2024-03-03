import express from 'express';

import { Blog, Category, User, Comment } from '../models';
import { validateNewBlog, validateBlogUpdate } from '../utils/input-validation';

import BadRequestError from '../errors/BadRequestError';
import NotFoundError from '../errors/NotFoundError';

const router = express.Router();

// eslint-disable-next-line  @typescript-eslint/no-misused-promises
router.get('/', async (_req, res, next) => {
  try {
    const allBlogs = await Blog.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'userId', 'categoryId'],
      },
      include: [
        {
          model: User,
          attributes: ['username', 'userIcon', 'status'],
        },
        {
          model: Category,
          attributes: ['categoryName'],
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

    if (!allBlogs) {
      throw new NotFoundError({ message: 'No blogs found' });
    }

    res.status(200).json(allBlogs);
  } catch (err: unknown) {
    next(err);
  }
});

// eslint-disable-next-line  @typescript-eslint/no-misused-promises
router.get('/:routeName', async (req, res, next) => {
  try {
    const blog = await Blog.findOne({
      attributes: {
        exclude: [
          'createdAt',
          'updatedAt',
          'userId',
          'categoryId',
          'routeName',
        ],
      },
      include: [
        {
          model: User,
          attributes: ['username', 'userIcon', 'status'],
        },
        {
          model: Category,
          attributes: ['categoryName'],
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
      where: { routeName: req.params.routeName },
    });
    if (!blog) {
      throw new NotFoundError({ message: 'Blog not found.' });
    }
    res.status(200).json(blog);
  } catch (err: unknown) {
    next(err);
  }
});

// eslint-disable-next-line  @typescript-eslint/no-misused-promises
router.post('/', async (req, res, next) => {
  try {
    const user = await User.findOne();

    if (!user) {
      throw new NotFoundError({ message: 'User not found' });
    }

    const validatedBlogData = validateNewBlog(req.body);
    if (validatedBlogData) {
      validatedBlogData.userId = user.id;

      const addedBlog = await Blog.create(validatedBlogData);
      res.status(201).json(addedBlog);
    } else {
      throw new BadRequestError({ message: 'Invalid Blog data.' });
    }
  } catch (err: unknown) {
    next(err);
  }
});

// eslint-disable-next-line  @typescript-eslint/no-misused-promises
router.put('/:routeName', async (req, res, next) => {
  try {
    const blogToUpdate = await Blog.findOne({
      where: { routeName: req.params.routeName },
    });
    if (!blogToUpdate) {
      throw new NotFoundError({ message: 'Blog to update was not found.' });
    }
    const validatedUpdateData = validateBlogUpdate(req.body);
    if (validatedUpdateData) {
      const updatedBlog = await Blog.update(validatedUpdateData, {
        where: { routeName: blogToUpdate.routeName },
        returning: true,
      });
      res.status(200).json(updatedBlog[1][0]);
    } else {
      // No update data => return original blog
      res.status(204).send();
    }
  } catch (err: unknown) {
    next(err);
  }
});

// eslint-disable-next-line  @typescript-eslint/no-misused-promises
router.delete('/:routeName', async (req, res, next) => {
  try {
    const blogToDelete = await Blog.findOne({
      where: { routeName: req.params.routeName },
    });
    if (!blogToDelete) {
      throw new NotFoundError({ message: 'Blog to delete was not found.' });
    }

    await blogToDelete.destroy();
    res.status(200).json({ message: `Deleted ${blogToDelete.routeName}` });
  } catch (err: unknown) {
    next(err);
  }
});

export default router;
