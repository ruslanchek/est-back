import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Advert } from '../advert/advert.entity';
import { EAgentType } from './agent.enum';

@Entity()
export class Agent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @OneToMany(type => Advert, advert => advert.agent)
  adverts: Advert[];
}
