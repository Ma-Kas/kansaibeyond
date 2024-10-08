/* eslint @typescript-eslint/no-misused-promises: 0 */

// Global Dependencies
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';

// Project Dependencies
import { auth } from './middleware/auth';
import { adminAuth } from './middleware/adminAuth';
import cmsAuthRouter from './routes/cms-routes/authentication';
import cmsLoginRouter from './routes/cms-routes/login';
import cmsLogoutRouter from './routes/cms-routes/logout';
import cmsUserRouter from './routes/cms-routes/users';
import cmsCategoryRouter from './routes/cms-routes/categories';
import cmsPostRouter from './routes/cms-routes/posts';
import cmsTagRouter from './routes/cms-routes/tags';
import cmsCommentRouter from './routes/cms-routes/comments';
import cmsAffiliateRouter from './routes/cms-routes/affiliates';
import cmsSocialMediaReelRouter from './routes/cms-routes/social-media-reels';

import frontendPostRouter from './routes/frontend-routes/posts';
import frontendPostSlugRouter from './routes/frontend-routes/post-slugs';
import frontendCategoryRouter from './routes/frontend-routes/categories';
import frontendTagRouter from './routes/frontend-routes/tags';
import frontendUserRouter from './routes/frontend-routes/users';
import frontendAffiliateRouter from './routes/frontend-routes/affiliates';
import frontendPreviewRouter from './routes/frontend-routes/preview';
import frontendSocialMediaReelRouter from './routes/frontend-routes/social-media-reels';

import healthRouter from './routes/health';

import errorHandler from './middleware/errorHandler';
import {
  setCMSCorsOptions,
  setFrontendCorsOptions,
} from './utils/set-cors-options';

// Express initialization
const app = express();
const cmsRouter = express.Router();
const frontendRouter = express.Router();

// Middleware
// Pass to cors below
const corsCMSOptions = setCMSCorsOptions();
const corsFrontendOptions = setFrontendCorsOptions();

app.use(helmet());
app.use(cookieParser());
app.use(express.json());

// Main Routes
app.use('/__health', healthRouter);
app.use('/api/cms', cors(corsCMSOptions), cmsRouter);
app.use('/api/frontend', cors(corsFrontendOptions), frontendRouter);

// CMS Routes
cmsRouter.use('/v1/auth', cmsAuthRouter);
cmsRouter.use('/v1/login', cmsLoginRouter);
cmsRouter.use('/v1/logout', auth, cmsLogoutRouter);

cmsRouter.use('/v1/users', cmsUserRouter);
cmsRouter.use('/v1/categories', auth, cmsCategoryRouter);
cmsRouter.use('/v1/posts', auth, cmsPostRouter);
cmsRouter.use('/v1/tags', auth, cmsTagRouter);
cmsRouter.use('/v1/comments', auth, cmsCommentRouter);
cmsRouter.use('/v1/affiliates', auth, adminAuth, cmsAffiliateRouter);
cmsRouter.use(
  '/v1/social-media-reels',
  auth,
  adminAuth,
  cmsSocialMediaReelRouter
);

// Frontend Routes
frontendRouter.use('/v1/posts', frontendPostRouter);
frontendRouter.use('/v1/post-slugs', frontendPostSlugRouter);
frontendRouter.use('/v1/categories', frontendCategoryRouter);
frontendRouter.use('/v1/tags', frontendTagRouter);
frontendRouter.use('/v1/users', frontendUserRouter);
frontendRouter.use('/v1/affiliates', frontendAffiliateRouter);
frontendRouter.use('/v1/preview', auth, frontendPreviewRouter);
frontendRouter.use('/v1/social-media-reels', frontendSocialMediaReelRouter);

// Error Handling
app.use(errorHandler);

export default app;
