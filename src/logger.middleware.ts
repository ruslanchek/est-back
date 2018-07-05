import { Injectable, NestMiddleware, MiddlewareFunction } from '@nestjs/common';
import express from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  resolve(...args: any[]): MiddlewareFunction {
    return (req: express.Request, res: express.Response, next) => {
      console.log(`Request`, req.method, req.path);
      next();
    };
  }
}