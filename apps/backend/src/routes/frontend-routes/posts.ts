/* eslint @typescript-eslint/no-misused-promises: 0 */

import express from 'express';
import * as postController from '../../controllers/frontend-controllers/postController';

const router = express.Router();

// GET route for retrieving multiple posts based on query string
router.get('/', postController.get_multiple_posts);

// GET route for retrieving all posts matching a search query
router.get('/search', postController.get_search_posts);

// GET route for retrieving one specific post based on postSlug query
router.get('/:postSlug', postController.get_one_post);

export default router;
