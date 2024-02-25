import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../errors/CustomError';
import { Error } from 'sequelize';

const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  // Handled errors
  if (err instanceof CustomError) {
    const { statusCode, errors, logging } = err;
    if (logging) {
      console.error(
        JSON.stringify(
          {
            code: err.statusCode,
            errors: err.errors,
            stack: err.stack,
          },
          null,
          2
        )
      );
    }

    return res.status(statusCode).send({ errors });
  }

  if (err instanceof Error) {
    switch (err.name) {
      case 'SequelizeValidationError':
        return res.status(400).send({ errors: [{ message: err.message }] });
      case 'SequelizeUniqueConstraintError':
        return res.status(400).send({ errors: [{ message: err.message }] });
      case 'SequelizeDatabaseError':
        return res.status(400).send({ errors: [{ message: err.message }] });
      case 'SequelizeForeignKeyConstraintError':
        return res.status(400).send({ errors: [{ message: err.message }] });
    }
  }

  // Unhandled errors
  console.error(JSON.stringify(err, null, 2));
  return res
    .status(500)
    .send({ errors: [{ message: 'UNHANDLED! Something went wrong' }] });

  next();
};

export default errorHandler;
