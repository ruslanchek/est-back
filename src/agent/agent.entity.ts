import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Advert } from '../advert/advert.entity';
import { EAgentType } from './agent.enum';

@Entity()
export class Agent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    charset: 'utf8',
    unique: true,
    select: false,
  })
  email: string;

  @Column({
    charset: 'utf8',
    select: false,
  })
  password: string;

  @Column({
    charset: 'utf8',
    default: '',
  })
  name: string;

  @Column({
    charset: 'utf8',
    default: '',
    select: false,
  })
  phone: string;

  @Column({
    charset: 'utf8',
    default: EAgentType.Private,
  })
  type: string;

  @OneToMany(type => Advert, advert => advert.agent)
  adverts: Advert[];
}
