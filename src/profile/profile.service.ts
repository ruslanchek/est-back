import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Api, IApiResult, IApiResultList, IApiResultOne, IApiResultUploadFile } from '../api';
import { Agent } from '../agent/agent.entity';
import { UpdateProfileDto, UpdateProfilePasswordDto } from './profile.dto';
import * as bcrypt from 'bcrypt';
import { MailingService } from '../mailing.service';
import { IFile, IFileResult, MAX_UPLOAD_SIZE, UPLOAD_IMAGE_RESIZE_DIMENSIONS, UploadService } from '../upload.service';
import * as uniqid from 'uniqid';
import { Advert } from '../advert/advert.entity';
import { Utils } from '../utils';

const PERSONAL_ENTITY_SELECT_FIELDS: FindOneOptions<Agent> = {
  select: [
    'id',
    'avatar',
    'email',
    'emailVerified',
    'name',
    'phone',
    'type',
  ],
};

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,
    @InjectRepository(Advert)
    private readonly advertRepository: Repository<Advert>,
    private readonly mailingService: MailingService,
    private readonly uploadService: UploadService,
  ) {
  }

  public async getProfile(agentId): Promise<IApiResult<IApiResultOne<Agent>>> {
    agentId = Utils.parseId(agentId);

    const entity: Agent = await this.agentRepository.findOne(
      { id: agentId },
      PERSONAL_ENTITY_SELECT_FIELDS,
    );

    if (entity) {
      return Api.result<IApiResultOne<Agent>>({
        entity,
      });
    } else {
      return Api.error({
        status: HttpStatus.NOT_FOUND,
        code: 'NOT_FOUND',
      });
    }
  }

  public async getAdverts(agentId: number): Promise<IApiResult<IApiResultList<Advert>>> {
    agentId = Utils.parseId(agentId);

    const list: Advert[] = await this.advertRepository.find({
      where: {
        agent: {
          id: agentId,
        },
      },

      order: {
        id: 'DESC',
      },
    });

    return Api.result<IApiResultList<Advert>>({
      list,
    });
  }

  public async update(agentId: number, dto: UpdateProfileDto): Promise<IApiResult<IApiResultOne<Agent>>> {
    agentId = Utils.parseId(agentId);

    const findResult: Agent = await this.agentRepository.findOne(agentId);

    if (findResult) {
      await this.agentRepository.update(
        { id: agentId },
        dto,
      );
      const entity: Agent = await this.agentRepository.findOne(agentId);

      return Api.result<IApiResultOne<Agent>>({
        entity,
      });
    } else {
      return Api.error({
        status: HttpStatus.NOT_FOUND,
        code: 'NOT_FOUND',
      });
    }
  }

  public async updatePassword(agentId, dto: UpdateProfilePasswordDto): Promise<IApiResult<IApiResultOne<Agent>>> {
    agentId = Utils.parseId(agentId);

    const findResult: Agent = await this.agentRepository.findOne({
      id: agentId,
    }, {
      select: [
        'password',
      ],
    });

    const passwordChecked: boolean = await bcrypt.compare(dto.oldPassword, findResult.password);

    if (passwordChecked) {
      const hashedPassword: string = await bcrypt.hash(dto.password, 10);

      await this.agentRepository.update(
        { id: agentId },
        { password: hashedPassword },
      );

      const entity: Agent = await this.agentRepository.findOne(
        { id: agentId },
        PERSONAL_ENTITY_SELECT_FIELDS,
      );

      await this.mailingService.sendPasswordChanged({
        agentName: entity.name,
        agentEmail: entity.email,
        agentId: entity.id,
        verificationCode: '',
      });

      return Api.result<IApiResultOne<Agent>>({
        entity,
      });
    } else {
      return Api.error({
        status: HttpStatus.BAD_REQUEST,
        code: 'WRONG_PASSWORD',
      });
    }
  }

  public async updateAvatar(agentId, file: IFile): Promise<IApiResult<IApiResultUploadFile>> {
    agentId = Utils.parseId(agentId);

    const imageId: string = uniqid();
    const fileResult: IFileResult[] = await this.uploadService.uploadImage(
      agentId,
      file,
      `agents/${agentId}/`,
      imageId,
      MAX_UPLOAD_SIZE.AVATAR,
      {
        entityId: agentId.toString(),
        entityKind: 'avatar',
        entityType: 'id',
        imageId,
      },
      [
        UPLOAD_IMAGE_RESIZE_DIMENSIONS.AVATAR,
      ],
    );

    if (fileResult) {
      await this.agentRepository.update(
        { id: agentId },
        { avatar: fileResult[0].path },
      );

      return Api.result<IApiResultUploadFile>({
        files: fileResult,
      });
    } else {
      return Api.error({
        status: HttpStatus.BAD_REQUEST,
        code: 'UPLOAD_ERROR',
      });
    }
  }
}
