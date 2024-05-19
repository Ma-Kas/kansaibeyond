/* eslint @typescript-eslint/no-misused-promises: 0 */

import express from 'express';
import * as logoutController from '../../controllers/cms-controllers/logoutController';

const router = express.Router();

// DELETE route for logging out user (=delete session)
router.delete('/', logoutController.logout);

export default router;
