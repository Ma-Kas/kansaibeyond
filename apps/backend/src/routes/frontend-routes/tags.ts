/* eslint @typescript-eslint/no-misused-promises: 0 */

import express from 'express';
import * as tagController from '../../controllers/frontend-controllers/tagController';

const router = express.Router();

// GET route for retrieving all tags
router.get('/', tagController.get_all_tags);

// GET route for retrieving specific category based on tagSlug
router.get('/:tagSlug', tagController.get_one_tag);

export default router;
