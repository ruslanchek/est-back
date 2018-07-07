import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Advert } from '../advert/advert.entity';

@Entity()
export class Agent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  phone: string;

  @Column()
  type: string;

  @OneToMany(type => Advert, advert => advert.agent)
  adverts: Advert[];
}
