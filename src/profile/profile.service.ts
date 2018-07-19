import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Api, IApiResult, IApiResultOne } from '../api';
import { Agent } from '../agent/agent.entity';
import { UpdateProfileDto, UpdateProfilePasswordDto } from './profile.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Agent)
    private readonly agentServiceRepository: Repository<Agent>,
  ) {
  }

  public async getProfile(id: number): Promise<IApiResult<IApiResultOne<Agent>>> {
    try {
      const entity: Agent = await this.agentServiceRepository.findOne(id, {
        select: [
          'id',
          'email',
          'emailVerified',
          'name',
          'phone',
          'type',
        ],
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
        throw new HttpException(null, HttpStatus.NOT_FOUND);
      }
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async updatePassword(id: number, dto: UpdateProfilePasswordDto): Promise<IApiResult<IApiResultOne<Agent>>> {
    try {
      const findResult: Agent = await this.agentServiceRepository.findOne(id, {
        select: ['password'],
      });

      if (findResult) {
        const passwordChecked: boolean = await bcrypt.compare(dto.oldPassword, findResult.password);

        if (passwordChecked) {
          const hashedPassword: string = await bcrypt.hash(dto.password, 10);
          await this.agentServiceRepository.update(
            { id },
            { password: hashedPassword },
          );
          const entity: Agent = await this.agentServiceRepository.findOne(id);

          return Api.result<IApiResultOne<Agent>>({
            entity,
          });
        } else {
          throw new HttpException(null, HttpStatus.BAD_REQUEST);
        }
      } else {
        throw new HttpException(null, HttpStatus.NOT_FOUND);
      }
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
