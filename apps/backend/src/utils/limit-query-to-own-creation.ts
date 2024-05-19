import { Request } from 'express';
import { InferAttributes, WhereOptions } from 'sequelize';
import { getTokenOrThrow } from './get-token-or-throw';
import { User } from '../models';

// Create a where object to limit query to own creation if not admin user
export const createUserWhere = (req: Request) => {
  const token = getTokenOrThrow(req);
  let where: WhereOptions<InferAttributes<User, { omit: never }>> = {};
  if (token.status !== 'Admin') {
    where = {
      username: token.username,
    };
  }

  return where;
};
