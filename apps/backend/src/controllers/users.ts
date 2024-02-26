import express from 'express';
import bcrypt from 'bcryptjs';

import { User } from '../models';
import { validateNewUser } from '../utils/inputValidation';

import BadRequestError from '../errors/BadRequestError';

const router = express.Router();

// Disabling this rule since solving error would require .then.catch
// or update to Express 5 (currently beta), or typecast as RequestHandler
// eslint-disable-next-line  @typescript-eslint/no-misused-promises
router.post('/', async (req, res, next) => {
  try {
    const newUser = validateNewUser(req.body);
    if (newUser) {
      newUser.password = await bcrypt.hash(newUser.password, 10);
      const addedUser = await User.create(newUser);
      res.status(201).json(addedUser);
    } else {
      throw new BadRequestError({ message: 'Invalid User data.' });
    }
  } catch (err: unknown) {
    next(err);
  }
});

export default router;
