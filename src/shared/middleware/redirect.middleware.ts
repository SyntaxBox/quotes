import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';

// if the req endpoint is not either /auth | /quotes will redirect to /quotes
@Injectable()
export class RedirectMiddleware implements NestMiddleware {
  use(req: any, res: Response, next: NextFunction) {
    // Define routes that should not be redirected
    const allowedRoutes = ['/auth', '/quotes'];

    // Check if the requested route is allowed
    if (allowedRoutes.includes(req.originalUrl)) {
      return next();
    }

    // Perform the redirection logic for other routes
    return res.redirect('/default-route');
  }
}
