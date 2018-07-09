import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Advert } from '../advert/advert.entity';
import { EAgentType } from './agent.enum';

@Entity()
export class Agent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    default: '',
  })
  name: string;

  @Column({
    default: '',
  })
  phone: string;

  @Column({
    default: EAgentType.Private,
  })
  type: string;

  @OneToMany(type => Advert, advert => advert.agent)
  adverts: Advert[];
}
