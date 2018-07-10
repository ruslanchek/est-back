import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinTable, JoinColumn } from 'typeorm';
import { Agent } from '../agent/agent.entity';

@Entity()
export class Advert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    charset: 'utf8',
  })
  title: string;

  @Column({
    charset: 'utf8',
  })
  type: string;

  @Column({
    charset: 'utf8',
  })
  contractType: string;

  @Column({
    type: 'double',
    default: 0,
  })
  constructionDate: number;

  @Column({
    type: 'double',
    default: 0,
  })
  price: number;

  @ManyToOne(type => Agent, agent => agent.adverts)
  agent: Agent;
}
