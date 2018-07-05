import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Agent } from '../agent/agent.entity';

@Entity()
export class Advert {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Agent)
  agent: Agent;
}