/* eslint @typescript-eslint/no-misused-promises: 0 */

import express from 'express';
import * as tagController from '../../controllers/cms-controllers/tagController';
import { adminAuth } from '../../middleware/adminAuth';

const router = express.Router();

// GET route for retrieving all tags
router.get('/', tagController.get_all_tags);

// GET route for retrieving one specific tag based on tagSlug query
router.get('/:tagSlug', tagController.get_one_tag);

// POST route for creating new tag
router.post('/', tagController.post_new_tag);

// PUT route for updating one specific tag based on tagSlug query
router.put('/:tagSlug', tagController.update_one_tag);

// DELETE route for deleting one specific tag based on tagSlug query
router.delete('/:tagSlug', adminAuth, tagController.delete_one_tag);

export default router;
