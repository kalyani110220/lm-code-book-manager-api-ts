import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../errors/NotFoundError';
import { BadRequestError } from  '../errors/BadRequestError';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error); // Log the error for debugging purposes

  if (error instanceof NotFoundError) {
    res.status(404).json({ message: error.message });
  } else if (error instanceof BadRequestError) {
    res.status(400).json({ message: error.message });
  } else {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
export const successHandler = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (res.statusCode === 200 || res.statusCode === 201 || res.statusCode === 204) {
      // Add success message if needed
      res.json({ message: 'Success' });
    } else {
      next();
    }
  };