// Global Dependencies
import express from 'express';

// Project Dependencies
import userRouter from './routes/users';
import categoryRouter from './routes/categories';
import postRouter from './routes/posts';
import commentRouter from './routes/comments';

import errorHandler from './middleware/errorHandler';

// Express initialization
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', userRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/posts', postRouter);
app.use('/api/comments', commentRouter);

// Error Handling
app.use(errorHandler);

export default app;
