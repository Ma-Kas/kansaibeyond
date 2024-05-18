/* eslint @typescript-eslint/no-misused-promises: 0 */

import express from 'express';
import * as loginController from '../../controllers/cms-controllers/loginController';

const router = express.Router();

// POST route for creating new post
router.post('/', loginController.post_login);

export default router;
