/* eslint @typescript-eslint/no-misused-promises: 0 */

import express from 'express';
import * as previewController from '../../controllers/frontend-controllers/previewController';

const router = express.Router();

// GET route for retrieving one specific post based on postSlug query
router.get('/:postSlug', previewController.get_one_post);

export default router;
