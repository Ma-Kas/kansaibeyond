// Global Dependencies
import express from 'express';

// Project Dependencies
import userRouter from './controllers/users';

import errorHandler from './middleware/errorHandler';

// Express initialization
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', userRouter);

// Error Handling
app.use(errorHandler);

export default app;
