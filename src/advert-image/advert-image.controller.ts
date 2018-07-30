import { Controller, Delete, FileInterceptor, Get, Param, Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AdvertImageService } from './advert-image.service';
import { AuthGuard } from '@nestjs/passport';
import { IFile } from '../upload.service';

@Controller('/api/advert-image')
export class AdvertImageController {
  constructor(private readonly advertImageService: AdvertImageService) {
  }

  @Post('/:objectId')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Request() req,
    @Param() params,
    @UploadedFile() file: IFile,
  ) {
    const { user } = req;

    return await this.advertImageService.upload(user.id, params.objectId, file);
  }

  @Delete('/:objectId/:imageId')
  @UseGuards(AuthGuard('jwt'))
  async delete(
    @Request() req,
    @Param() params,
  ) {
    const { user } = req;

    return await this.advertImageService.delete(user.id, params.objectId, params.imageId);
  }
}
