/* eslint @typescript-eslint/no-misused-promises: 0 */

import express from 'express';
import * as healthController from '../controllers/healthController';

const router = express.Router();

// GET route for retrieving all affiliates
router.get('/', healthController.get_health);

export default router;
