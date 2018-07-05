import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Dummy {
  @PrimaryGeneratedColumn()
  id: number;
}