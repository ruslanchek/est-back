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

  @Column('double')
  constructionDate: number;

  @Column('double')
  price: number;

  @ManyToOne(type => Agent, agent => agent.adverts)
  agent: Agent;
}
