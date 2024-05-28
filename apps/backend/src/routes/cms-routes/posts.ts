/* eslint @typescript-eslint/no-misused-promises: 0 */

import express from 'express';
import * as postController from '../../controllers/cms-controllers/postController';

const router = express.Router();

// GET route for retrieving all posts
router.get('/', postController.get_all_posts);

// GET route for retrieving one specific post based on postSlug query
router.get('/:postSlug', postController.get_one_post);

// POST route for creating new post
router.post('/', postController.post_new_post);

// PUT route for updating one specific post based on postSlug query
router.put('/:postSlug', postController.update_one_post);

// PUT route for trashing one specific post based on postSlug query
router.put('/:postSlug/trash', postController.trash_one_post);

// DELETE route for deleting one specific post based on postSlug query
router.delete('/:postSlug', postController.delete_one_post);

export default router;
