import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdvertImage } from './advert-image.entity';
import { Advert } from '../advert/advert.entity';
import { IFile } from '../upload.service';
import { Api, IApiResult, IApiResultUploadFile } from '../api';

@Injectable()
export class AdvertImageService {
  constructor(
    @InjectRepository(AdvertImage)
    private readonly advertImageServiceRepository: Repository<AdvertImage>,
    @InjectRepository(Advert)
    private readonly advertServiceRepository: Repository<Advert>,
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
        console.log(findResult);

      } else {
        return Api.error({
          status: HttpStatus.NOT_FOUND,
          code: 'ADVERT_NOT_FOUND',
        });
      }

      // const fileResult: IFileResult = await this.uploadService.uploadImage(
      //   file,
      //   `objects/${agentId}/${id}/`,
      //   `${fileName}`,
      //   MAX_UPLOAD_SIZE.OBJECT_PICTURE,
      //   {
      //     entityId: id.toString(),
      //     entityKind: 'avatar',
      //     entityType: 'id',
      //   },
      // );

      // await this.agentServiceRepository.update(
      //   { id },
      //   { avatar: true, },
      // );

      // return Api.result<IApiResultUploadFile>({
      //   file: fileResult,
      // });
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}