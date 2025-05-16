import { Request } from 'express';

export interface ExtendedRequest extends Request {
  'request-id'?: string;
  'user-ip'?: string;
  rolePermissions?: string;
  userId?: number | string;
  isLogger?: boolean;
  username?: string;
}