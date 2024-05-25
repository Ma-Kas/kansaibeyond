/* eslint @typescript-eslint/no-misused-promises: 0 */

// Global Dependencies
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// Project Dependencies
import { auth } from './middleware/auth';
import cmsLoginRouter from './routes/cms-routes/login';
import cmsLogoutRouter from './routes/cms-routes/logout';
import cmsUserRouter from './routes/cms-routes/users';
import cmsCategoryRouter from './routes/cms-routes/categories';
import cmsPostRouter from './routes/cms-routes/posts';
import cmsTagRouter from './routes/cms-routes/tags';
import cmsCommentRouter from './routes/cms-routes/comments';
import cmsAffiliateRouter from './routes/cms-routes/affiliates';

import frontendPostRouter from './routes/frontend-routes/posts';
import frontendCategoryRouter from './routes/frontend-routes/categories';

import errorHandler from './middleware/errorHandler';
import setCorsOptions from './utils/set-cors-options';

// Express initialization
const app = express();
const cmsRouter = express.Router();
const frontendRouter = express.Router();

// Middleware
// Pass to cors below
const corsOptions = setCorsOptions();

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());

// Main Routes
app.use('/api/cms', cmsRouter);
app.use('/api/frontend', frontendRouter);

// CMS Routes
cmsRouter.use('/v1/login', cmsLoginRouter);
cmsRouter.use('/v1/logout', auth, cmsLogoutRouter);

cmsRouter.use('/v1/users', cmsUserRouter);
cmsRouter.use('/v1/categories', auth, cmsCategoryRouter);
cmsRouter.use('/v1/posts', auth, cmsPostRouter);
cmsRouter.use('/v1/tags', auth, cmsTagRouter);
cmsRouter.use('/v1/comments', auth, cmsCommentRouter);
cmsRouter.use('/v1/affiliates', auth, cmsAffiliateRouter);

// Frontend Routes
frontendRouter.use('/v1/posts', frontendPostRouter);
frontendRouter.use('/v1/categories', frontendCategoryRouter);

// Error Handling
app.use(errorHandler);

export default app;
