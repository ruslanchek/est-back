import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Advert } from '../advert/advert.entity';
import { EAgentType } from './agent.enum';

@Entity()
export class Agent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: '',
    select: true,
  })
  avatar: string;

  @Column({
    unique: true,
    select: false,
  })
  email: string;

  @Column({
    select: false,
  })
  password: string;

  @Column({
    default: false,
    select: false,
  })
  emailVerified: boolean;

  @Column({
    default: '',
    select: false,
  })
  emailVerificationCode: string;

  @Column({
    default: '',
  })
  name: string;

  @Column({
    default: '',
    select: false,
  })
  phone: string;

  @Column({
    default: EAgentType.Private,
  })
  type: string;

  @OneToMany(type => Advert, advert => advert.agent)
  adverts: Advert[];
}
