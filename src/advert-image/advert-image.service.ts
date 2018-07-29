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

      console.log(agentId, advertId, file);

      if (findResult) {
        const newEntity: Partial<AdvertImage> = {
          order: 0,
          title: '',
          advert: { id: advertId } as Advert,
          agent: { id: agentId } as Agent,
        };

        const imageInsertResult: InsertResult = await this.advertImageServiceRepository.insert(newEntity);

        if (imageInsertResult && imageInsertResult.identifiers) {
          const imageId: number = imageInsertResult.identifiers[0].id;
          const imageUniqId: string = uniqid();
          const fileResult: IFilesResult[] = await this.uploadService.uploadImage(
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

          await this.advertImageServiceRepository.update({ id: imageId }, {
            big: fileResult.find(f => f.name === 'big').path,
            thumb: fileResult.find(f => f.name === 'thumb').path,
          });

          if (fileResult) {
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
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}