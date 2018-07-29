import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdvertImage } from './advert-image.entity';
import { Advert } from '../advert/advert.entity';
import { IFile, IFileResult, MAX_UPLOAD_SIZE, UPLOAD_IMAGE_RESIZE_DIMENSIONS, UploadService } from '../upload.service';
import { Api, IApiResult, IApiResultUploadFile } from '../api';

@Injectable()
export class AdvertImageService {
  constructor(
    @InjectRepository(AdvertImage)
    private readonly advertImageServiceRepository: Repository<AdvertImage>,
    @InjectRepository(Advert)
    private readonly advertServiceRepository: Repository<Advert>,
    private readonly uploadService: UploadService,
  ) {

  }

  public async upload(agentId: number, objectId: number, file: IFile): Promise<IApiResult<IApiResultUploadFile>> {
    try {
      const findResult: Advert = await this.advertServiceRepository.findOne({
          id: objectId,
          agent: { id: agentId },
        },
        {
          relations: ['agent'],
        });

      if (findResult) {
        const fileResult: IFileResult = await this.uploadService.uploadImage(
          file,
          `adverts/${agentId}/${objectId}/`,
          `1`,
          MAX_UPLOAD_SIZE.OBJECT_PICTURE,
          {
            entityId: objectId.toString(),
            entityKind: 'avatar',
            entityType: 'id',
          },
          [
            UPLOAD_IMAGE_RESIZE_DIMENSIONS.IMAGE,
            UPLOAD_IMAGE_RESIZE_DIMENSIONS.IMAGE_THUMB,
          ],
        );

        return Api.result<IApiResultUploadFile>({
          file: fileResult,
        });
      } else {
        return Api.error({
          status: HttpStatus.NOT_FOUND,
          code: 'ADVERT_NOT_FOUND',
        });
      }
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}