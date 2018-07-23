import { Injectable, NestMiddleware, MiddlewareFunction } from '@nestjs/common';
import * as multer from 'multer';

@Injectable()
export class UploadMiddleware implements NestMiddleware {
  resolve(): (req, res, next) => void {
    const upload = multer({
      dest: './uploads/',
    });
    return upload.any();
  }
}