// Global Dependencies
import express from 'express';
import cors from 'cors';

// Project Dependencies
import cmsLoginRouter from './routes/cms-routes/login';
import cmsUserRouter from './routes/cms-routes/users';
import cmsCategoryRouter from './routes/cms-routes/categories';
import cmsPostRouter from './routes/cms-routes/posts';
import cmsTagRouter from './routes/cms-routes/tags';
import cmsCommentRouter from './routes/cms-routes/comments';
import cmsAffiliateRouter from './routes/cms-routes/affiliates';

import frontendPostRouter from './routes/frontend-routes/posts';
import frontendCategoryRouter from './routes/frontend-routes/categories';

import errorHandler from './middleware/errorHandler';

// Express initialization
const app = express();
const cmsRouter = express.Router();
const frontendRouter = express.Router();

// Middleware
// Setting allowed addresses to communicate with backend
// const allowedOrigins = [''];

// Pass to cors below
// const options: cors.CorsOptions = {
//   origin: allowedOrigins,
// };

app.use(cors());
app.use(express.json());

// Main Routes
app.use('/api/cms', cmsRouter);
app.use('/api/frontend', frontendRouter);

// CMS Routes
cmsRouter.use('/v1/login', cmsLoginRouter);

cmsRouter.use('/v1/users', cmsUserRouter);
cmsRouter.use('/v1/categories', cmsCategoryRouter);
cmsRouter.use('/v1/posts', cmsPostRouter);
cmsRouter.use('/v1/tags', cmsTagRouter);
cmsRouter.use('/v1/comments', cmsCommentRouter);
cmsRouter.use('/v1/affiliates', cmsAffiliateRouter);

// Frontend Routes
frontendRouter.use('/v1/posts', frontendPostRouter);
frontendRouter.use('/v1/categories', frontendCategoryRouter);

// Error Handling
app.use(errorHandler);

export default app;
