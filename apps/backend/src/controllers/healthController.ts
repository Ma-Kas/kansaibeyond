import { Request, Response, NextFunction } from 'express';

export const get_health = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.sendStatus(200);
  } catch (err: unknown) {
    next(err);
  }
};
