import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Advert } from '../advert/advert.entity';
import { Agent } from '../agent/agent.entity';

@Entity()
export class AdvertImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: '',
  })
  title: string;

  @Column({
    default: 0,
  })
  order: number;

  @Column({
    default: '',
  })
  thumb: string;

  @Column({
    default: '',
  })
  big: string;

  @ManyToOne(type => Advert, advert => advert.images)
  advert: Advert;

  @ManyToOne(type => Agent)
  agent: Agent;
}
