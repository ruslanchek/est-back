import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { AdvertImage } from './advert-image.entity';
import { Advert } from '../advert/advert.entity';
import {
  IFile,
  IFileDeleteResult,
  IFileResult,
  MAX_IMAGES_PER_ADVERT,
  MAX_UPLOAD_SIZE,
  UPLOAD_IMAGE_RESIZE_DIMENSIONS,
  UploadService,
} from '../upload.service';
import { Api, IApiResult, IApiResultDeleteFile, IApiResultUploadFile } from '../api';
import * as uniqid from 'uniqid';
import { Agent } from '../agent/agent.entity';
import { Utils } from '../utils';

@Injectable()
export class AdvertImageService {
  constructor(
    @InjectRepository(AdvertImage)
    private readonly advertImageRepository: Repository<AdvertImage>,
    @InjectRepository(Advert)
    private readonly advertRepository: Repository<Advert>,
    private readonly uploadService: UploadService,
  ) {

  }

  public async delete(agentId, advertId, imageId): Promise<IApiResult<IApiResultDeleteFile>> {
    agentId = Utils.parseId(agentId);
    advertId = Utils.parseId(advertId);
    imageId = Utils.parseId(imageId);

    const imagesResult: AdvertImage = await this.advertImageRepository.findOne({
      id: imageId,
      advert: { id: advertId },
      agent: { id: agentId },
    });

    const filesDeleteResult: IFileDeleteResult[] = await this.uploadService.deleteImage(imageId, [
      `${imagesResult.thumb}.jpg`,
      `${imagesResult.big}.jpg`,
      `${imagesResult.thumb}.webp`,
      `${imagesResult.big}.webp`,
    ]);

    await this.advertImageRepository.delete({
      id: imageId,
      advert: { id: advertId },
      agent: { id: agentId },
    });

    return Api.result<IApiResultDeleteFile>({
      files: filesDeleteResult,
    });
  }

  public async upload(agentId: number, advertId: number, file: IFile): Promise<IApiResult<IApiResultUploadFile>> {
    agentId = Utils.parseId(agentId);
    advertId = Utils.parseId(advertId);

    const findResult: Advert = await this.advertRepository.findOne({
      id: advertId,
      agent: { id: agentId },
    }, {
      relations: [
        'agent',
        'images',
      ],
    });

    if (findResult) {
      if (findResult.images.length >= MAX_IMAGES_PER_ADVERT) {
        return Api.error({
          status: HttpStatus.FORBIDDEN,
          code: 'IMAGES_LIMIT',
        });
      }

      const newEntity: Partial<AdvertImage> = {
        order: 0,
        title: '',
        advert: { id: advertId } as Advert,
        agent: { id: agentId } as Agent,
      };

      const imageInsertResult: InsertResult = await this.advertImageRepository.insert(newEntity);

      if (imageInsertResult && imageInsertResult.identifiers) {
        const imageId: number = imageInsertResult.identifiers[0].id;
        const imageUniqId: string = uniqid();
        const fileResult: IFileResult[] = await this.uploadService.uploadImage(
          imageId,
          file,
          `adverts/${agentId}/${advertId}/`,
          imageUniqId,
          MAX_UPLOAD_SIZE.OBJECT_PICTURE,
          {
            entityId: advertId.toString(),
            entityKind: 'advertImage',
            entityType: 'id',
            imageId: imageId.toString(),
          },
          [
            UPLOAD_IMAGE_RESIZE_DIMENSIONS.IMAGE,
            UPLOAD_IMAGE_RESIZE_DIMENSIONS.IMAGE_THUMB,
          ],
        );

        if (fileResult) {
          await this.advertImageRepository.update({ id: imageId }, {
            big: fileResult.find(f => f.name === 'big').path,
            thumb: fileResult.find(f => f.name === 'thumb').path,
          });

          return Api.result<IApiResultUploadFile>({
            files: fileResult,
          });
        } else {
          return Api.error({
            status: HttpStatus.BAD_REQUEST,
            code: 'UPLOAD_ERROR',
          });
        }
      } else {
        return Api.error({
          status: HttpStatus.BAD_REQUEST,
          code: 'UPLOAD_ERROR',
        });
      }
    } else {
      return Api.error({
        status: HttpStatus.NOT_FOUND,
        code: 'ADVERT_NOT_FOUND',
      });
    }
  }
}
