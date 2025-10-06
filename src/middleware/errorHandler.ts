import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  let message = err.message;

  // Make generic errors more user-friendly
  if (statusCode === 500 && !message) {
    message = 'Something went wrong on our end. Please try again.';
  }

  if (statusCode === 404 && !message) {
    message = 'The requested resource could not be found.';
  }

  res.status(statusCode).json({
    success: false,
    error: message || 'An unexpected error occurred. Please try again.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `The page '${req.originalUrl}' doesn't exist. Please check the URL and try again.`
  });
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};