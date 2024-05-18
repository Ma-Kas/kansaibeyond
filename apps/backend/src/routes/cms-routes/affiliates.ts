/* eslint @typescript-eslint/no-misused-promises: 0 */

import express from 'express';
import * as affiliateController from '../../controllers/cms-controllers/affiliateController';

const router = express.Router();

// GET route for retrieving all affiliates
router.get('/', affiliateController.get_all_affiliates);

// GET route for retrieving one specific affiliate based on id query
router.get('/:id', affiliateController.get_one_affiliate);

// POST route for creating new affiliate
router.post('/', affiliateController.post_new_affiliate);

// PUT route for updating one specific affiliate based on id query
router.put('/:id', affiliateController.update_one_affiliate);

// DELETE route for deleting one specific affiliate based on id query
router.delete('/:id', affiliateController.delete_one_affiliate);

export default router;
