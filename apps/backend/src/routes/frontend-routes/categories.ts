/* eslint @typescript-eslint/no-misused-promises: 0 */

import express from 'express';
import * as categoryController from '../../controllers/frontend-controllers/categoryController';

const router = express.Router();

// GET route for retrieving all categories
router.get('/', categoryController.get_all_categories);

export default router;
