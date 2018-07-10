import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AUTH_POLICY } from './auth.policy';
import { IJwtPayload, ITokenPayload } from './auth.interface';
import { AgentService } from '../agent/agent.service';
import { Api, IApiResult, IApiResultOne } from '../api';
import { Agent } from '../agent/agent.entity';
import { AuthAgentDto, UpdateAgentPasswordDto } from '../agent/agent.dto';

@Injectable()
export class AuthService {
  constructor(private readonly agentService: AgentService) {
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

  async login(dto: AuthAgentDto): Promise<IApiResult<ITokenPayload>> {
    const entity = await this.agentService.findOneByEmailForAuth(dto.email);

    if (entity) {
      const passwordChecked: boolean = await bcrypt.compare(dto.password, entity.password);

      if (passwordChecked) {
        const tokenPayload: ITokenPayload = await this.createToken({
          id: entity.id,
        });

        return Api.result<ITokenPayload>(tokenPayload);
      } else {
        throw new HttpException(null, HttpStatus.UNAUTHORIZED);
      }
    } else {
      throw new HttpException(null, HttpStatus.UNAUTHORIZED);
    }
  }

  async register(dto: AuthAgentDto): Promise<IApiResult<ITokenPayload>> {
    const entityFound = await this.agentService.findOneByEmailForAuth(dto.email);

    if (entityFound) {
      throw new HttpException(null, HttpStatus.CONFLICT);
    } else {
      const entityNew = await this.agentService.insert(dto);
      const tokenPayload = await this.createToken({
        id: entityNew.id,
      });

      return Api.result<ITokenPayload>(tokenPayload);
    }
  }

  async passwordChange(dto: UpdateAgentPasswordDto): Promise<IApiResult<ITokenPayload>> {
    // const entityFound = await this.agentService.findOneByEmailForAuth(dto.email);
  }
}
