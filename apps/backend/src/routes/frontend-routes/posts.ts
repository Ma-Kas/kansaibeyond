/* eslint @typescript-eslint/no-misused-promises: 0 */

import express from 'express';
import * as postController from '../../controllers/frontend-controllers/postController';

const router = express.Router();

// GET route for retrieving all posts
router.get('/', postController.get_all_posts);

// GET route for retrieving one specific post based on postSlug query
router.get('/:postSlug', postController.get_one_post);

export default router;
