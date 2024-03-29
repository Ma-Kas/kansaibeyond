// Global Dependencies
import express from 'express';

// Project Dependencies
import userRouter from './controllers/users';
import categoryRouter from './controllers/categories';
import blogRouter from './controllers/blogs';
import commentRouter from './controllers/comments';

import errorHandler from './middleware/errorHandler';

// Express initialization
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', userRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/blogs', blogRouter);
app.use('/api/comments', commentRouter);

// Error Handling
app.use(errorHandler);

export default app;
