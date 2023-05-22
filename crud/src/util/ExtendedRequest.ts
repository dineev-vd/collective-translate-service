import User from 'entities/user.entity';
import { Request } from 'express';

export type ExtendedRequest = Omit<Request, 'user'> & {
  user: User;
};
