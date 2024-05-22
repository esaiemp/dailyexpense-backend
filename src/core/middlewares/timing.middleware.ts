import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TimingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TimingMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const start = process.hrtime();

    res.on('finish', () => {
      const duration = process.hrtime(start);
      const ms = duration[0] * 1000 + duration[1] / 1000000;
      this.logger.log(`Request to ${req.originalUrl} took ${ms.toFixed(2)} ms`);
    });

    next();
  }
}
