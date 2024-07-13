/* eslint @typescript-eslint/no-misused-promises: 0 */

import express from 'express';
import * as affiliateController from '../../controllers/frontend-controllers/affiliateController';

const router = express.Router();

// GET route for retrieving all affiliates
router.get('/', affiliateController.get_all_affiliates);

export default router;
