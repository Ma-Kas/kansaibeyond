/* eslint @typescript-eslint/no-misused-promises: 0 */

import express from 'express';
import * as socialMediaReelController from '../../controllers/frontend-controllers/socialMediaReelController';

const router = express.Router();

// GET route for retrieving one specific social media reel
router.get('/', socialMediaReelController.get_one_reel);

export default router;
