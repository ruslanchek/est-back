import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AUTH_POLICY } from './auth.policy';
import { IJwtPayload, ITokenPayload } from './auth.interface';
import { AgentService } from '../agent/agent.service';
import { Api, IApiResult, IApiResultCreate, IApiResultOne } from '../api';
import { Agent } from '../agent/agent.entity';
import { MailingService } from '../mailing.service';
import { InsertResult } from 'typeorm/query-builder/result/InsertResult';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Agent)
    private readonly agentServiceRepository: Repository<Agent>,
    private readonly agentService: AgentService,
    private readonly mailingService: MailingService,
  ) {
  }

  async createToken(payload: IJwtPayload): Promise<ITokenPayload> {
    const accessToken = jwt.sign(payload, AUTH_POLICY.SECRET_KEY, {
      expiresIn: AUTH_POLICY.EXPIRES_IN,
    });

    return {
      expiresIn: AUTH_POLICY.EXPIRES_IN,
      accessToken,
    };
  }

  async validateUser(payload: IJwtPayload): Promise<IApiResult<IApiResultOne<Agent>>> {
    return await this.agentService.findOne(payload.id);
  }

  async login(dto: AuthDto): Promise<IApiResult<ITokenPayload>> {
    try {
      const entity = await this.findOneByEmail(dto.email);

      if (entity) {
        const passwordChecked: boolean = await bcrypt.compare(dto.password, entity.password);

        if (passwordChecked) {
          const tokenPayload: ITokenPayload = await this.createToken({
            id: entity.id,
          });

          return Api.result<ITokenPayload>(tokenPayload);
        } else {
          return Api.error({
            status: HttpStatus.UNAUTHORIZED,
            code: 'WRONG_CREDENTIALS',
          });
        }
      } else {
        return Api.error({
          status: HttpStatus.UNAUTHORIZED,
          code: 'WRONG_CREDENTIALS',
        });
      }
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOneByEmail(email: string): Promise<Agent> {
    try {
      return await this.agentServiceRepository.findOne({
        email,
      }, {
        select: [
          'password',
        ],
      });
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async register(dto: AuthDto): Promise<IApiResult<ITokenPayload>> {
    try {
      const entityFound = await this.findOneByEmail(dto.email);

      if (entityFound) {
        return Api.error({
          status: HttpStatus.CONFLICT,
          code: 'CONFLICT',
        });
      } else {
        const verificationCode: string = await bcrypt.hash(dto.email, 5);
        const name = dto.email.match(/^([^@]*)@/)[1];
        const entityNew = await this.insert(Object.assign(dto, { name }));
        const tokenPayload = await this.createToken({
          id: entityNew.id,
        });

        await this.mailingService.sendWelcome({
          agentName: name,
          agentEmail: dto.email,
          agentId: entityNew.id,
          verificationCode,
        });

        return Api.result<ITokenPayload>(tokenPayload);
      }
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async insert(dto: AuthDto): Promise<IApiResultCreate> {
    try {
      const hashedPassword: string = await bcrypt.hash(dto.password, 10);
      const result: InsertResult = await this.agentServiceRepository.insert(Object.assign(dto, {
        password: hashedPassword,
      }));

      return {
        id: result.identifiers[0].id,
      };
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
