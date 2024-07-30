/* eslint @typescript-eslint/no-misused-promises: 0 */

import express from 'express';
import * as socialMediaReelController from '../../controllers/cms-controllers/socialMediaReelController';

const router = express.Router();

// GET route for retrieving all social media reels
router.get('/', socialMediaReelController.get_all_reels);

// GET route for retrieving one specific social media reel based on id query
router.get('/:id', socialMediaReelController.get_one_reel);

// POST route for creating new social media reel
router.post('/', socialMediaReelController.post_new_reel);

// PUT route for updating one specific social media reel based on id query
router.put('/:id', socialMediaReelController.update_one_reel);

export default router;
