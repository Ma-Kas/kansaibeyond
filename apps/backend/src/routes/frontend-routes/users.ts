/* eslint @typescript-eslint/no-misused-promises: 0 */

import express from 'express';
import * as userController from '../../controllers/frontend-controllers/userController';

const router = express.Router();

// GET route for retrieving all users
router.get('/', userController.get_all_users);

// GET route for retrieving specific user based on username
router.get('/:username', userController.get_one_user);

export default router;
