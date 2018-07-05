import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class ObjectItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Agent)
  agent: Agent
}