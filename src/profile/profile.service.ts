import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Api, IApiResult, IApiResultOne } from '../api';
import { Agent } from '../agent/agent.entity';
import { UpdateProfileDto, UpdateProfilePasswordDto } from './profile.dto';
import * as bcrypt from 'bcrypt';
import { MailingService } from '../mailing.service';

const PERSONAL_ENTITY_SELECT_FIELDS = [
  'id',
  'email',
  'emailVerified',
  'name',
  'phone',
  'type',
];

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Agent)
    private readonly agentServiceRepository: Repository<Agent>,
    private readonly mailingService: MailingService,
  ) {
  }

  public async getProfile(id: number): Promise<IApiResult<IApiResultOne<Agent>>> {
    try {
      const entity: Agent = await this.agentServiceRepository.findOne(id, {
        select: PERSONAL_ENTITY_SELECT_FIELDS,
      });

      if (entity) {
        return Api.result<IApiResultOne<Agent>>({
          entity,
        });
      } else {
        throw new HttpException(null, HttpStatus.NOT_FOUND);
      }
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async update(id: number, dto: UpdateProfileDto): Promise<IApiResult<IApiResultOne<Agent>>> {
    try {
      const findResult: Agent = await this.agentServiceRepository.findOne(id);

      if (findResult) {
        await this.agentServiceRepository.update(
          { id },
          dto,
        );
        const entity: Agent = await this.agentServiceRepository.findOne(id);

        return Api.result<IApiResultOne<Agent>>({
          entity,
        });
      } else {
        return Api.error({
          status: HttpStatus.NOT_FOUND,
          code: 'NOT_FOUND',
        });
      }
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async updatePassword(id: number, dto: UpdateProfilePasswordDto): Promise<IApiResult<IApiResultOne<Agent>>> {
    try {
      const findResult: Agent = await this.agentServiceRepository.findOne(id, {
        select: [
          'password',
        ],
      });

      if (findResult) {
        const passwordChecked: boolean = await bcrypt.compare(dto.oldPassword, findResult.password);

        if (passwordChecked) {
          const hashedPassword: string = await bcrypt.hash(dto.password, 10);
          await this.agentServiceRepository.update(
            { id },
            { password: hashedPassword },
          );
          const entity: Agent = await this.agentServiceRepository.findOne({ id }, {
            select: PERSONAL_ENTITY_SELECT_FIELDS,
          });

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
            code: 'BAD_REQUEST',
          });
        }
      } else {
        return Api.error({
          status: HttpStatus.NOT_FOUND,
          code: 'NOT_FOUND',
        });
      }
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
