import { Request } from 'express';
import { InferAttributes, WhereOptions } from 'sequelize';
import { getSessionOrThrow } from './get-session-or-throw';
import { User } from '../models';

// Create a where object to limit query to own creation if not admin user
export const createUserWhere = (req: Request) => {
  const session = getSessionOrThrow(req);
  let where: WhereOptions<InferAttributes<User, { omit: never }>> = {};
  if (session.role !== 'ADMIN') {
    where = {
      id: session.userId,
    };
  }

  return where;
};
