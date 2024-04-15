/* eslint @typescript-eslint/no-misused-promises: 0 */

import express from 'express';
import * as categoryController from '../controllers/categoryController';

const router = express.Router();

// GET route for retrieving all categories
router.get('/', categoryController.get_all_categories);

// GET route for retrieving one specific category based on categorySlug query
router.get('/:categorySlug', categoryController.get_one_category);

// POST route for creating new category
router.post('/', categoryController.post_new_category);

// PUT route for updating one specific category based on categorySlug query
router.put('/:categorySlug', categoryController.update_one_category);

// DELETE route for deleting one specific category based on categorySlug query
router.delete('/:categorySlug', categoryController.delete_one_category);

export default router;
