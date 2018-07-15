import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinTable, JoinColumn } from 'typeorm';
import { Agent } from '../agent/agent.entity';

@Entity()
export class Advert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  type: string;

  @Column()
  contractType: string;

  @Column({
    type: 'decimal',
    default: 0,
  })
  constructionDate: number;

  @Column({
    type: 'decimal',
    default: 0,
  })
  price: number;

  @ManyToOne(type => Agent, agent => agent.adverts)
  agent: Agent;
}
