import { Request, NextFunction } from 'express';

export function Middleware(
  req: Request,
  next: NextFunction,
) {
  console.log(req.method, req.url, 'has been excuted');
  next();
}
