import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Advert } from '../advert/advert.entity';

@Entity()
export class Agent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(type => Advert, advert => advert.agent)
  adverts: Advert[];
}
