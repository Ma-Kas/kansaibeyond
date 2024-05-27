/* eslint @typescript-eslint/no-misused-promises: 0 */

import express from 'express';
import * as authenticationController from '../../controllers/cms-controllers/authenticationController';

const router = express.Router();

// GET route for retrieving authentication
router.get('/', authenticationController.get_authentication);

export default router;
