/* eslint @typescript-eslint/no-misused-promises: 0 */

import express from 'express';
import * as categoryController from '../controllers/categoryController';

const router = express.Router();

// GET route for retrieving all categories
router.get('/', categoryController.get_all_categories);

// GET route for retrieving one specific category based on categoryName query
router.get('/:categoryName', categoryController.get_one_category);

// POST route for creating new category
router.post('/', categoryController.post_new_category);

// PUT route for updating one specific category based on categoryName query
router.put('/:categoryName', categoryController.update_one_category);

// DELETE route for deleting one specific category based on categoryName query
router.delete('/:categoryName', categoryController.delete_one_category);

export default router;
