/* eslint @typescript-eslint/no-misused-promises: 0 */

import express from 'express';
import * as commentController from '../../controllers/cms-controllers/commentController';

const router = express.Router();

// GET route for retrieving all comments
router.get('/', commentController.get_all_comments);

// GET route for retrieving one specific comment based on id query
router.get('/:id', commentController.get_one_comment);

// POST route for creating new comment
router.post('/', commentController.post_new_comment);

// NO UPDATE ROUTE AS COMMENTS NOT MEANT TO BE EDITED

// DELETE route for deleting one specific comment based on id query
router.delete('/:id', commentController.delete_one_comment);

export default router;
