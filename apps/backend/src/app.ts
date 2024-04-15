// Global Dependencies
import express from 'express';

// Project Dependencies
import userRouter from './routes/users';
import categoryRouter from './routes/categories';
import postRouter from './routes/posts';
import tagRouter from './routes/tags';
import commentRouter from './routes/comments';
import affiliateRouter from './routes/affiliates';

import errorHandler from './middleware/errorHandler';

// Express initialization
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', userRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/posts', postRouter);
app.use('/api/tags', tagRouter);
app.use('/api/comments', commentRouter);
app.use('/api/affiliates', affiliateRouter);

// Error Handling
app.use(errorHandler);

export default app;
