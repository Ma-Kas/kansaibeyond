/* eslint @typescript-eslint/no-misused-promises: 0 */

// Disabling this rule since solving error would require .then.catch
// or update to Express 5 (currently beta), or typecast as RequestHandler

import express from 'express';
import * as userController from '../../controllers/cms-controllers/userController';

const router = express.Router();

// GET route for retrieving all users
router.get('/', userController.get_all_users);

// GET route for retrieving one specific user based on username query
router.get('/:username', userController.get_one_user);

// POST route for creating new user
router.post('/', userController.post_new_user);

// PUT route for updating one specific user based on username query
router.put('/:username', userController.update_one_user);

// PUT route for disabling one specific user based on username query
router.put('/disable/:username', userController.disable_one_user);

// DELETE route for deleting one specific user based on username query
router.delete('/:username', userController.delete_one_user);

export default router;
