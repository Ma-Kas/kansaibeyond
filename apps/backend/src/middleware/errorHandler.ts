import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../errors/CustomError';
import { BaseError, UniqueConstraintError } from 'sequelize';

const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  // Custom handled errors
  if (err instanceof CustomError) {
    const { statusCode, errors, logging } = err;
    // Console error only if logging is enabled
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

  // Sequelize Errors
  if (err instanceof UniqueConstraintError) {
    return res
      .status(400)
      .send({ errors: [{ message: `${err.name}: ${err.errors[0].message}` }] });
  }

  if (err instanceof BaseError) {
    return res
      .status(400)
      .send({ errors: [{ message: `${err.name}: ${err.message}` }] });
  }

  // Unhandled errors
  console.error(JSON.stringify(err, null, 2));
  console.log(err);
  res
    .status(500)
    .send({ errors: [{ message: 'UNHANDLED! Something went wrong' }] });
  return next();
};

export default errorHandler;
