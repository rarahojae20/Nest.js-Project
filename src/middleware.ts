import { Request, Response, NextFunction } from 'express';

export function Middleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log(req.method, req.url, 'has been excuted');
  next();
}
