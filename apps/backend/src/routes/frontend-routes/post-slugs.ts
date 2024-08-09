/* eslint @typescript-eslint/no-misused-promises: 0 */

import express from 'express';
import * as postSlugController from '../../controllers/frontend-controllers/postSlugController';

const router = express.Router();

// GET route for retrieving list of all published post slugs
router.get('/', postSlugController.get_post_slug_list);

export default router;
