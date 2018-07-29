import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { AdvertImage } from './advert-image.entity';
import { Advert } from '../advert/advert.entity';
import { IFile, IFilesResult, MAX_UPLOAD_SIZE, UPLOAD_IMAGE_RESIZE_DIMENSIONS, UploadService } from '../upload.service';
import { Api, IApiResult, IApiResultUploadFile } from '../api';
import * as uniqid from 'uniqid';
import { Agent } from '../agent/agent.entity';

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

  public async upload(agentId: number, advertId: number, file: IFile): Promise<IApiResult<IApiResultUploadFile>> {
    try {
      const findResult: Advert = await this.advertServiceRepository.findOne({
          id: advertId,
          agent: { id: agentId },
        },
        {
          relations: ['agent'],
        });

      if (findResult) {
        const newEntity: Partial<AdvertImage> = {
          order: 0,
          title: '',
          advert: { id: advertId } as Advert,
          agent: { id: agentId } as Agent,
        };
        await this.advertImageServiceRepository.insert(newEntity);
        const imageId: string = uniqid();
        const fileResult: IFilesResult[] = await this.uploadService.uploadImage(
          file,
          `adverts/${agentId}/${advertId}/`,
          imageId,
          MAX_UPLOAD_SIZE.OBJECT_PICTURE,
          {
            entityId: advertId.toString(),
            entityKind: 'advertImage',
            entityType: 'id',
            imageId,
          },
          [
            UPLOAD_IMAGE_RESIZE_DIMENSIONS.IMAGE,
            UPLOAD_IMAGE_RESIZE_DIMENSIONS.IMAGE_THUMB,
          ],
        );

        return Api.result<IApiResultUploadFile>({
          files: fileResult,
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